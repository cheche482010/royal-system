import { ref } from 'vue'
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  LockIcon
} from 'lucide-vue-next';

export default {
  name: 'Productdetails',
  components: {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    LockIcon,
    Header
  },
  setup() {
    const router = useRouter();
    const quantity = ref(1); // Mover la definición de quantity dentro del setup
    
    const productItems = ref([
      {
        id: 1,
        name: 'Producto I',
        brand: 'BRIT',
        price: 36.89,
        quantity: 1,
        inventory: 150,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
      },
    ]);

    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity < 1) return;

      const itemIndex = productItems.value.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        productItems.value[itemIndex].quantity = newQuantity;
      }
    };

    const increaseQuantity = () => {
      quantity.value++;
      updateQuantity(productItems.value[0].id, quantity.value);
    };

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
        updateQuantity(productItems.value[0].id, quantity.value);
      }
    };

    const checkout = () => {
      router.push('/cart');
    };
    
    return {
      productItems,
      quantity,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      checkout
    };
  },
}