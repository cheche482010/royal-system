import { ref, onMounted } from 'vue';
import { StarIcon, ArrowRightIcon, DogIcon, CatIcon, ShoppingCartIcon } from 'lucide-vue-next';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.vue';
import { apiService } from '../../services/api.service';
import { useToast } from '../../services/toast.service';

export default { 
  name: 'Home',
  components: {
    StarIcon,
    ArrowRightIcon,
    DogIcon,
    CatIcon, 
    ShoppingCartIcon,
    Header,
    Footer,
    ProductCarousel
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
      link: '/Product'
    });
    
    const featuredProducts = ref([]);
    
    const setActiveSlide = (index) => {
      activeSlide.value = index;
    };
    
    const setActiveTab = (tabId) => {
      activeTab.value = tabId;
    };
    
    // Cargar productos destacados
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

    onMounted(() => {
      loadFeaturedProducts();
    });

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