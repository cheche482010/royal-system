import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  LockIcon,
  Search
} from 'lucide-vue-next';
import { useAuth } from '../../composables/useAuth';

export default {
  name: 'ProductDetails',
  components: {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    LockIcon,
    Search,
    Header
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const auth = useAuth();
    
    // Estado para la cantidad
    const quantity = ref(1);
    
    // Estado para el zoom de imagen
    const showZoom = ref(false);
    
    // Estado para la imagen seleccionada
    const selectedImageIndex = ref(0);
    
    // Datos del producto actual
    const productItems = ref([
      {
        id: 1,
        name: 'Producto I',
        brand: 'BRIT',
        price: 36.89,
        quantity: 1,
        inventory: 150,
        images: [
          'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100',
          'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100',
          'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
        ]
      },
    ]);

    // Productos relacionados
    const relatedProductsdetails = ref([
      {
          id: 3,
          name: 'Producto I',
          brand: 'Marca',
          price: 47.46,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=150&width=150'
      },
      {
          id: 4,
          name: 'Producto II',
          brand: 'Marca',
          price: 12.99,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=150&width=150'
      },
      {
          id: 5,
          name: 'Producto III',
          brand: 'Marca',
          price: 39.95,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=150&width=150'
      },
      {
          id: 6,
          name: 'Producto IV',
          brand: 'Marca',
          price: 14.50,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=150&width=150'
      }
    ]);

    // Calcular el precio total basado en la cantidad
    const totalPrice = computed(() => {
      return (productItems.value[0].price * quantity.value).toFixed(2);
    });

    // Obtener la imagen principal actual
    const currentImage = computed(() => {
      return productItems.value[0].images[selectedImageIndex.value];
    });

    // Actualizar la cantidad
    const updateQuantity = (newQuantity) => {
      if (newQuantity < 1) return;
      quantity.value = newQuantity;
    };

    // Incrementar cantidad
    const increaseQuantity = () => {
      quantity.value++;
    };

    // Decrementar cantidad
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    // Cambiar la imagen seleccionada
    const selectImage = (index) => {
      selectedImageIndex.value = index;
    };

    // Mostrar/ocultar zoom de imagen
    const toggleZoom = () => {
      showZoom.value = !showZoom.value;
    };

    // Cerrar zoom al hacer clic fuera de la imagen
    const closeZoom = (event) => {
      if (event.target.classList.contains('zoom-overlay')) {
        showZoom.value = false;
      }
    };

    // Agregar al carrito
    const addToCart = () => {
      // Verificar si el usuario está autenticado
      if (!auth.isAuthenticated.value) {
        router.push('/login');
        return;
      }

      const product = productItems.value[0];
      
      // Crear el objeto del producto para el carrito
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: quantity.value,
        image: product.images[0]
      };

      // Obtener el carrito actual del localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
      
      if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad
        cart[existingItemIndex].quantity += cartItem.quantity;
      } else {
        // Si no existe, agregar al carrito
        cart.push(cartItem);
      }
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Actualizar el contador del carrito en el header
      updateCartCount();
      
      // Mostrar mensaje de éxito (puedes implementar un sistema de notificaciones)
      alert('Producto agregado al carrito');
    };

    // Ver opciones de un producto relacionado
    const viewProductOptions = (product) => {
      // Navegar a la página de detalles del producto seleccionado
      router.push({
        path: '/productdetails',
        query: { id: product.id }
      });
    };

    // Actualizar el contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      // Aquí deberías tener una forma de actualizar el contador en el header
      // Por ejemplo, usando un estado global o un evento personalizado
      
      // Para este ejemplo, vamos a usar localStorage para comunicarnos con el componente Header
      localStorage.setItem('cartCount', cart.length);
      
      // Disparar un evento personalizado para que el Header lo escuche
      window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    // Inicializar
    onMounted(() => {
      // Aquí podrías cargar los datos del producto basado en el ID de la URL
      const productId = route.query.id;
      if (productId) {
        // Cargar datos del producto con ese ID
        // fetchProductDetails(productId);
        console.log('Cargando producto con ID:', productId);
      }
      
      // Inicializar el contador del carrito
      updateCartCount();
    });
    
    return {
      productItems,
      relatedProductsdetails,
      quantity,
      totalPrice,
      currentImage,
      selectedImageIndex,
      showZoom,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      selectImage,
      toggleZoom,
      closeZoom,
      addToCart,
      viewProductOptions
    };
  },
}