  import { ref } from 'vue';
  import { SearchIcon, TruckIcon, UserIcon, LogInIcon, ShoppingCartIcon, TagIcon } from 'lucide-vue-next';
  
  export default {
    name: 'Header',
    components: {
      SearchIcon,
      TruckIcon,
      UserIcon,
      LogInIcon,
      ShoppingCartIcon,
      TagIcon
    },
    setup() {
      const cartCount = ref(0);
      const categories = ref([
        { id: 1, name: 'Item I' },
        { id: 2, name: 'Item II' },
        { id: 3, name: 'Item III' },
        { id: 4, name: 'Item IV' },
      ]);

      const logo = ref({
        image: new URL('../../assets/img/logo.jpg', import.meta.url).href,
        name: 'Pet Shop'
      });
  
      return {
        cartCount,
        categories,
        logo
      };
    }
  };