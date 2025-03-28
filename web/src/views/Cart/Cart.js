import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
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
            
            // También actualizar localStorage
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = storedCart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            
            // Actualizar contador
            localStorage.setItem('cartCount', updatedCart.length);
            window.dispatchEvent(new CustomEvent('cart-updated'));
        };

        const checkout = () => {
            router.push('/payment');
        };
        
        // Cargar carrito desde localStorage
        const loadCartFromStorage = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            cartItems.value = storedCart;
            
            // Log para verificar que llegó el item
            console.log('Items en cartItems:', cartItems.value);
        };

        onMounted(() => {
            loadCartFromStorage();
        });

        return {
            cartItems,
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