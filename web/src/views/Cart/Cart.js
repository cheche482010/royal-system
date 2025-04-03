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

        const featuredProducts = ref([]);
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

        const loadFeaturedProducts = async () => {
            try {
                const response = await apiService.getAllProducts();
                if (!response.success || !response.data) {
                    throw new Error('Respuesta inválida del servidor');
                }

                // Tomar los primeros 5 productos activos como destacados
                featuredProducts.value = response.data
                    .filter(p => p.is_active)
                    .slice(0, 5)
                    .map(p => ({
                        id: p.id,
                        name: p.nombre,
                        brand: p.Marca?.nombre || 'Sin marca',
                        price: p.precio_unidad,
                        image: p.producto_img
                    }));
            } catch (error) {
                console.error('Error al cargar productos destacados:', error);
                useToast().error('Error al cargar productos destacados', {
                    title: 'Error'
                });
            }
        };


        // Inicializar
        onMounted(async () => {
            await loadCartFromStorage();
            loadFeaturedProducts();
        });

        return {
            cartItems,
            promoCode,
            subtotal,
            shipping,
            discount,
            total,
            featuredProducts,
            formatPrice,
            updateQuantity,
            removeItem,
            checkout
        };
    }
};