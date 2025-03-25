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
      relatedProductsdetails,
      quantity,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      checkout
    };
  },
}