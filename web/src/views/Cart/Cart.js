import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import { apiService } from '../../services/api.service';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.vue';
import {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    LockIcon
} from 'lucide-vue-next';

export default {
    name: 'Cart',
    components: {
        MinusIcon,
        PlusIcon,
        TrashIcon,
        ShoppingCartIcon,
        LockIcon,
        Header,
        Footer,
        ProductCarousel
    },
    setup() {
        const router = useRouter();
        
        // Carrito de items agregados desde ProductDetails
        const cartItems = ref([]);

        const relatedProducts = ref([
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
            },
            {
                id: 7,
                name: 'Producto V',
                brand: 'Marca',
                price: 22.75,
                image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=150&width=150'
            }
        ]);

        const promoCode = ref('');
        const appliedPromo = ref(null);

        const subtotal = computed(() => {
            const total = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return formatPrice(total);
        });

        const shipping = computed(() => {
            const subtotalValue = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return subtotalValue >= 59 ? 'Gratis' : formatPrice(4.99);
        });

        const discount = computed(() => {
            if (!appliedPromo.value) return null;

            const subtotalValue = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discountAmount = subtotalValue * (appliedPromo.value.percentage / 100);
            return formatPrice(discountAmount);
        });

        const total = computed(() => {
            let totalValue = cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Aplicar descuento si hay un código promocional
            if (appliedPromo.value) {
                totalValue -= totalValue * (appliedPromo.value.percentage / 100);
            }

            // Añadir gastos de envío si es necesario
            if (totalValue < 59) {
                totalValue += 4.99;
            }

            return formatPrice(totalValue);
        });

        const formatPrice = (price) => {
            return `${price.toFixed(2).replace('.', ',')}$`;
        };

        const updateQuantity = (itemId, newQuantity) => {
            if (newQuantity < 1) return;

            const itemIndex = cartItems.value.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                cartItems.value[itemIndex].quantity = newQuantity;
            }
        };

        const removeItem = (itemId) => {
            cartItems.value = cartItems.value.filter(item => item.id !== itemId);
            
            // Actualizar localStorage
            localStorage.setItem('cart', JSON.stringify(cartItems.value));
            
            // Actualizar contador
            localStorage.setItem('cartCount', cartItems.value.length);
            window.dispatchEvent(new CustomEvent('cart-updated'));
        };

        const checkout = () => {
            router.push('/payment');
        };

        const loadCartFromStorage = async () => {
            try {
                const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Obtener detalles actualizados de cada producto
                const updatedCart = await Promise.all(
                  storedCart.map(async (item) => {
                    try {
                      const product = await apiService.getProductById(item.id);
                      if (product && product.is_active) {
                        return {
                          ...item,
                          name: product.nombre,
                          brand: product.marca?.nombre || 'Sin marca',
                          price: product.precio_unidad,
                          image: product.producto_img,
                          maxQuantity: product.inventario?.cantidad_actual || 0
                        };
                      }
                      return null; // Producto no encontrado o inactivo
                    } catch (error) {
                      console.error(`Error al cargar producto ${item.id}:`, error);
                      return null;
                    }
                  })
                );
                
                // Filtrar productos nulos y actualizar carrito
                cartItems.value = updatedCart.filter(item => item !== null);
                
                // Actualizar localStorage con datos actualizados
                localStorage.setItem('cart', JSON.stringify(cartItems.value));
              } catch (error) {
                console.error('Error al cargar el carrito:', error);
                useToast().error('Error al cargar el carrito', {
                  title: 'Error'
                });
              }
              window.dispatchEvent(new CustomEvent('cart-updated'));
        };

        // Inicializar
        onMounted(async () => {
            await loadCartFromStorage();
        });

        return {
            cartItems,
            relatedProducts,
            promoCode,
            subtotal,
            shipping,
            discount,
            total,
            formatPrice,
            updateQuantity,
            removeItem,
            checkout
        };
    }
};