import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import { apiService } from '../../services/api.service';
import { useCartService } from '../../services/cart.service';
import { config } from '../../config/config'
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
    const router = useRouter();
    const cartService = useCartService();
    
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
        // Cargar items del carrito
        const cartItems = await cartService.getCartItems();
        orderItems.value = cartItems.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));

        // Cargar métodos de pago
        const methodsResponse = await apiService.get('/metodos-pago');
        if (methodsResponse.success && methodsResponse.data) {
          paymentMethods.value = methodsResponse.data;
        }

        // Cargar bancos
        const banksResponse = await apiService.get('/bancos');
        if (banksResponse.success && banksResponse.data) {
          banks.value = banksResponse.data;
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        loading.value = false;
      }
    };

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
      // Aquí iría la lógica de descuentos si aplica
      return null;
    });

    const total = computed(() => {
      let totalValue = orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Añadir gastos de envío si es necesario
      if (totalValue < 59) {
        totalValue += 4.99;
      }

      // Actualizar el monto en la información de pago
      paymentInfo.value.amount = formatPrice(totalValue);

      return formatPrice(totalValue);
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
      return `${price.toFixed(2).replace('.', ',')}$`;
    };

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
       
        console.log('Procesando pago...');
        console.log('Información de pago:', paymentInfo.value);
        console.log('Información de envío:', shippingInfo.value);
        
      
        setTimeout(() => {
          router.push('/confirmation');
        }, 1500);
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    };

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
      isFormValid,
      formatPrice,
      handleFileUpload,
      removeFile,
      confirmPayment,
      loading,
      bankData,
      activeTab
    };
  }
};