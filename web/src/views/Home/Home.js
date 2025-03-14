
import { ref } from 'vue';
import { StarIcon, ArrowRightIcon, DogIcon, CatIcon, ShoppingCartIcon } from 'lucide-vue-next';

export default {
  name: 'Home',
  components: {
    StarIcon,
    ArrowRightIcon,
    DogIcon,
    CatIcon, 
    ShoppingCartIcon
  },
  setup() {
    const activeSlide = ref(0);
    const activeTab = ref('perros');
    
    const banners = ref([
      {
        brand: 'TRAVENESS',
        title: 'Productos 100% naturales',
        features: [
          { icon: 'div', text: 'PREBIÓTICOS' },
          { icon: 'div', text: 'EXTRACTOS BOTÁNICOS' },
          { icon: 'div', text: 'SUPLEMENTOS' }
        ],
        discount: '-15% dto.',
        subtitle: 'Recetas de Salmón y Pollo',
        cta: 'ver oferta',
        link: '/offer/traveness',
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg'
      },
      // Más banners aquí
    ]);
    
    const categoryTabs = ref([
      { id: 'perros', name: 'Perros', icon: DogIcon },
      { id: 'gatos', name: 'Gatos', icon: CatIcon }
    ]);
    
    const featuredSection = ref({
      title: 'Productos',
      link: '/category/products'
    });
    
    const featuredProducts = ref([
      {
        id: 1,
        name: 'Producto 1',
        brand: 'marca',
        price: '36,49$',
        rating: 5,
        reviews: 2004,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200'
      },
      {
        id: 2,
        name: 'Producto 2',
        brand: 'marca',
        price: '27,15$',
        rating: 5,
        reviews: 1544,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200'
      },
      {
        id: 3,
        name: 'Producto 4',
        brand: 'marca',
        price: '30,89$',
        rating: 5,
        reviews: 283,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200'
      },
      {
        id: 4,
        name: 'Producto 5',
        brand: 'marca',
        price: '29,99$',
        rating: 5,
        reviews: 97,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200'
      }
    ]);
    
    const setActiveSlide = (index) => {
      activeSlide.value = index;
    };
    
    const setActiveTab = (tabId) => {
      activeTab.value = tabId;
    };
    
    return {
      activeSlide,
      activeTab,
      banners,
      categoryTabs,
      featuredSection,
      featuredProducts,
      setActiveSlide,
      setActiveTab
    };
  }
};