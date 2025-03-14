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
        { id: 'perros', name: 'Perros' },
        { id: 'gatos', name: 'Gatos' },
        { id: 'roedores', name: 'Roedores' },
        { id: 'pajaros', name: 'Pájaros' },
        { id: 'peces', name: 'Peces' }
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