import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ShoppingCartIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  EyeIcon
} from 'lucide-vue-next';

export default {
  name: 'ProductCarousel',
  components: {
    ShoppingCartIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter();
    const carouselTrack = ref(null);
    const scrollPosition = ref(0);
    const maxScrollPosition = ref(0);
    const scrollAmount = 300; // Cantidad de píxeles a desplazar

    // Calcular la posición máxima de desplazamiento
    const calculateMaxScroll = () => {
      if (carouselTrack.value) {
        maxScrollPosition.value = carouselTrack.value.scrollWidth - carouselTrack.value.clientWidth;
      }
    };

    // Desplazar a la izquierda
    const scrollLeft = () => {
      if (carouselTrack.value) {
        const newPosition = Math.max(0, scrollPosition.value - scrollAmount);
        carouselTrack.value.scrollTo({
          left: newPosition,
          behavior: 'smooth'
        });
        scrollPosition.value = newPosition;
      }
    };

    // Desplazar a la derecha
    const scrollRight = () => {
      if (carouselTrack.value) {
        const newPosition = Math.min(maxScrollPosition.value, scrollPosition.value + scrollAmount);
        carouselTrack.value.scrollTo({
          left: newPosition,
          behavior: 'smooth'
        });
        scrollPosition.value = newPosition;
      }
    };

    // Ver detalles del producto
    const viewProductDetails = (product) => {
      router.push({
        path: '/productdetails',
        query: { id: product.id }
      });
    };

    // Agregar al carrito
    const addToCart = (product) => {
      // Crear el objeto del producto para el carrito
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace('$', '').replace(',', '.')) 
          : product.price,
        quantity: 1,
        image: product.image
      };

      // Obtener el carrito actual del localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
      
      if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad
        cart[existingItemIndex].quantity += 1;
      } else {
        // Si no existe, agregar al carrito
        cart.push(cartItem);
      }
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Actualizar el contador del carrito en el header
      updateCartCount();
      
      // Mostrar mensaje de éxito
      alert('Producto agregado al carrito');
    };

    // Actualizar el contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      localStorage.setItem('cartCount', cart.length);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    // Manejar el evento de desplazamiento
    const handleScroll = () => {
      if (carouselTrack.value) {
        scrollPosition.value = carouselTrack.value.scrollLeft;
      }
    };

    // Inicializar
    onMounted(() => {
      calculateMaxScroll();
      window.addEventListener('resize', calculateMaxScroll);
      
      if (carouselTrack.value) {
        carouselTrack.value.addEventListener('scroll', handleScroll);
      }
    });

    return {
      carouselTrack,
      scrollPosition,
      maxScrollPosition,
      scrollLeft,
      scrollRight,
      viewProductDetails,
      addToCart
    };
  }
};