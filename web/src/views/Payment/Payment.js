import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
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
    UploadIcon,
    FileIcon,
    XIcon,
    LockIcon
  },
  setup() {
    const router = useRouter();
    
    // Datos del pedido (normalmente vendrían del carrito o del store)
    const orderItems = ref([
      {
        id: 1,
        name: 'Producto I',
        brand: 'Marca',
        price: 36.49,
        quantity: 1,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
      },
      {
        id: 2,
        name: 'Producto I',
        brand: 'Marca',
        price: 30.89,
        quantity: 2,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
      }
    ]);

    // Información de pago
    const paymentInfo = ref({
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
      zip: '',
      phone: ''
    });

    // Estado del archivo
    const fileSelected = ref(false);
    const fileName = ref('');

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
        paymentInfo.value.bank &&
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

    const confirmPayment = () => {
      // Aquí iría la lógica para procesar el pago
      console.log('Procesando pago...');
      console.log('Información de pago:', paymentInfo.value);
      console.log('Información de envío:', shippingInfo.value);
      
      // Simulación de procesamiento exitoso
      setTimeout(() => {
        // Redirigir a una página de confirmación
        router.push('/confirmation');
      }, 1500);
    };

    return {
      orderItems,
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
      confirmPayment
    };
  }
};