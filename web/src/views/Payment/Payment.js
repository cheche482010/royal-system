import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import { apiService } from '../../services/api.service';
import { useCartService } from '../../services/cart.service';
import { config } from '../../config/config'
import { useToast } from "../../services/toast.service"
import { useCouponService } from "../../services/coupon.service"
import { useDolarStore } from '../../stores/dolar'

import {
  UploadIcon,
  FileIcon,
  XIcon,
  LockIcon
} from 'lucide-vue-next';

export default {
  name: 'Payment',
  components: {
    Header,
    Footer,
    UploadIcon,
    FileIcon,
    XIcon,
    LockIcon
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    }
  },
  setup(props) {
    const router = useRouter()
    const cartService = useCartService()
    const toast = useToast()
    const couponService = useCouponService()
    const checkoutData = ref(null)
    const dolarStore = useDolarStore()
    const dollarRate = computed(() => dolarStore.dollarRate)

    // Datos bancarios
    const bankData = {
      cuenta: {
        nombre: 'ROYAL PET C.A',
        banco: 'BANESCO',
        cuenta: '0134-0416-05-4161028192',
        tipoCuenta: 'Corriente',
        rif: 'J403113661'
      },
      pagoMovil: {
        banco: 'BANESCO',
        rif: 'J403113661',
        telefono: '0414-5044409'
      }
    };

    // Tab activo
    const activeTab = ref('cuenta');

    // Datos del pedido desde el carrito
    const orderItems = ref([]);
    const paymentMethods = ref([]);
    const banks = ref([]);

    const loading = ref(true);

    // Información de pago
    const paymentInfo = ref({
      metodo_pago: '',
      bank: '',
      reference: '',
      amount: '',
      receipt: null
    });

    // Información de envío
    const shippingInfo = ref({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    });

    // Estado del archivo
    const fileSelected = ref(false);
    const fileName = ref('');

    // Cargar datos iniciales
    const loadInitialData = async () => {
      try {

        checkoutData.value = JSON.parse(localStorage.getItem('checkoutData'))

        const methodsResponse = await apiService.get('/metodos-pago');
        if (methodsResponse.success && methodsResponse.data) {
          paymentMethods.value = methodsResponse.data;
        }

        const banksResponse = await apiService.get('/bancos');
        if (banksResponse.success && banksResponse.data) {
          banks.value = banksResponse.data;
        }

        if (checkoutData.value) {
          orderItems.value = checkoutData.value.items
          if (checkoutData.value.coupon) {
            discount.value = checkoutData.value.discount
          }
        } else {

          const cartItems = await cartService.getCartItems()
          orderItems.value = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        }

      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        loading.value = false
      }
    }

    // Cálculos del pedido
    const subtotal = computed(() => {
      const total = orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return formatPrice(total);
    });

    const shipping = computed(() => {
      const subtotalValue = orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return subtotalValue >= 59 ? 'Gratis' : formatPrice(4.99);
    });

    const discount = computed(() => {
      return checkoutData.value?.discount || null
    })

    const coupon = computed(() => {
      return checkoutData.value?.coupon.code || null
    })

    const total = computed(() => {
      let totalValue = checkoutData.value?.total || 0;

      if (totalValue < 59) {
        totalValue += 4.99;
      }

      paymentInfo.value.amount = formatPriceBs(totalValue);
      return formatPrice(totalValue);
    });

    const totalBs = computed(() => {
      let totalValue = checkoutData.value?.total || 0;

      if (totalValue < 59) {
        totalValue += 4.99;
      }

      return formatPriceBs(totalValue);
    });

    // Validación del formulario
    const isFormValid = computed(() => {
      return (
        paymentInfo.value.metodo_pago &&
        (paymentInfo.value.metodo_pago === '1' ? paymentInfo.value.bank : true) &&
        paymentInfo.value.reference &&
        fileSelected.value &&
        shippingInfo.value.name &&
        shippingInfo.value.address &&
        shippingInfo.value.city &&
        shippingInfo.value.state &&
        shippingInfo.value.phone
      );
    });

    // Funciones
    const formatPrice = (price) => {
      if (typeof price === 'string') return price
      return `${price.toFixed(2).replace(".", ",")}$`
    }

    const formatPriceBs = (price) => {
      const rate = dollarRate.value?._value || dollarRate.value
      const numericPrice = typeof price === 'string'
        ? parseFloat(price.replace(',', '.'))
        : Number(price)

      if (!rate || isNaN(numericPrice)) return '--.-- BS'

      return (numericPrice * Number(rate).toFixed(2)).toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' BS'
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        paymentInfo.value.receipt = file;
        fileName.value = file.name;
        fileSelected.value = true;
      }
    };

    const removeFile = () => {
      paymentInfo.value.receipt = null;
      fileName.value = '';
      fileSelected.value = false;
      // Resetear el input file
      const fileInput = document.getElementById('receipt');
      if (fileInput) fileInput.value = '';
    };

    const confirmPayment = async () => {
      try {
        // Obtener datos del checkout
        const checkoutData = JSON.parse(localStorage.getItem('checkoutData'))

        // Crear la orden primero
        const orderResponse = await apiService.post('/ordenes', getToken(), {
          usuario_id: getUserId(),
          monto_total: parseFloat(total.value.replace(',', '').replace('$', '')),
          items: orderItems.value
        })

        if (!orderResponse.success) {
          throw new Error(orderResponse.message || "Error al crear la orden")
        }

        const orderId = orderResponse.data.id

        // Si hay cupón aplicado, registrarlo
        if (checkoutData?.coupon) {
          const couponResponse = await couponService.applyCoupon(
            checkoutData.coupon.code,
            orderId
          )

          if (!couponResponse.success) {
            console.error("Error al aplicar cupón:", couponResponse.message)
          }
        }

        // Procesar el pago
        const paymentResponse = await apiService.post('/pagos', getToken(), {
          orden_id: orderId,
          metodo_pago_id: paymentInfo.value.metodo_pago,
          referencia: paymentInfo.value.reference,
          monto: parseFloat(paymentInfo.value.amount.replace(',', '').replace('$', '')),
          comprobante_img: paymentInfo.value.receipt
        })

        if (!paymentResponse.success) {
          throw new Error(paymentResponse.message || "Error al procesar el pago")
        }

        // Limpiar el carrito
        await cartService.clearCart()
        localStorage.removeItem('checkoutData')

        // Redirigir a confirmación
        router.push('/confirmation')
      } catch (error) {
        console.error('Error al procesar el pago:', error)
        toast.error("Error al procesar el pago", {
          title: "Error",
          description: error.message
        })
      }
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      loadInitialData();
    });

    return {
      orderItems,
      paymentMethods,
      banks,
      paymentInfo,
      shippingInfo,
      fileSelected,
      fileName,
      subtotal,
      shipping,
      discount,
      total,
      coupon,
      isFormValid,
      formatPrice,
      handleFileUpload,
      removeFile,
      confirmPayment,
      loading,
      bankData,
      activeTab,
      totalBs,
      formatPrice,
      formatPriceBs,
      dollarRate
    };
  }
};