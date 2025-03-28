import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, EyeIcon, ShoppingCartIcon } from 'lucide-vue-next';
import { useToast } from '../../services/toast.service';

export default {
  name: 'ProductCarousel',
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    StarIcon,
    EyeIcon,
    ShoppingCartIcon
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
    const toast = useToast();
    const carouselRef = ref(null);
    const showLeftArrow = ref(false);
    const showRightArrow = ref(false);
    
    // Calcular si se deben mostrar las flechas de navegación
    const updateArrows = () => {
      if (!carouselRef.value) return;
      
      const container = carouselRef.value;
      
      // Mostrar flecha izquierda si hay scroll hacia la izquierda
      showLeftArrow.value = container.scrollLeft > 0;
      
      // Mostrar flecha derecha si hay más contenido a la derecha
      showRightArrow.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
    };
    
    // Desplazar a la izquierda
    const scrollLeft = () => {
      if (!carouselRef.value) return;
      
      const container = carouselRef.value;
      const scrollAmount = container.clientWidth * 0.8; // Desplazar 80% del ancho visible
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    };
    
    // Desplazar a la derecha
    const scrollRight = () => {
      if (!carouselRef.value) return;
      
      const container = carouselRef.value;
      const scrollAmount = container.clientWidth * 0.8; // Desplazar 80% del ancho visible
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
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
      try {
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
        
        // Mostrar toast de éxito
        toast.success(`${product.name} ha sido agregado exitosamente`, {
          title: 'Producto agregado'
        });
      } catch (error) {
        // Mostrar toast de error
        toast.error(`No se ha podido agregar ${product.name} al carrito`, {
          title: 'Error'
        });
        console.error('Error al agregar al carrito:', error);
      }
    };
    
    // Actualizar el contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      localStorage.setItem('cartCount', cart.length);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    };
    
    // Formatear precio
    const formatPrice = (price) => {
      if (typeof price === 'string') {
        return price;
      }
      return `${price.toFixed(2)}$`;
    };
    
    // Mostrar flechas solo si hay más de 4 productos
    const shouldShowArrows = computed(() => {
      return props.products.length > 4;
    });
    
    onMounted(() => {
      // Inicializar estado de las flechas
      updateArrows();
      
      // Agregar listener para actualizar flechas al hacer scroll
      if (carouselRef.value) {
        carouselRef.value.addEventListener('scroll', updateArrows);
      }
      
      // Verificar si se deben mostrar las flechas inicialmente
      if (carouselRef.value) {
        showRightArrow.value = carouselRef.value.scrollWidth > carouselRef.value.clientWidth;
      }
    });
    
    return {
      carouselRef,
      showLeftArrow,
      showRightArrow,
      scrollLeft,
      scrollRight,
      viewProductDetails,
      addToCart,
      formatPrice,
      shouldShowArrows,
      updateArrows
    };
  }
};