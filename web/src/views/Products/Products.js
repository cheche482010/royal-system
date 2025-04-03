import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
import { apiService } from '../../services/api.service';

import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon, 
  FilterIcon,
  XIcon,
  LayoutGridIcon,
  ListIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchXIcon,
  EyeIcon
} from 'lucide-vue-next';
import { useToast } from '../../services/toast.service';

export default {
  name: 'Products',
  components: {
    StarIcon,
    HeartIcon,
    ShoppingCartIcon,
    FilterIcon,
    XIcon,
    LayoutGridIcon,
    ListIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchXIcon,
    EyeIcon,
    Header,
    Footer
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const category = ref({
      id: 'perros',
      name: 'Productos para Perros',
      description: 'Todo lo que necesitas para el cuidado y bienestar de tu perro'
    });
    
    const subcategories = ref([
      { id: 1, name: 'Alimento para Gatos', count: 24 },
      { id: 2, name: 'Alimento para Perros', count: 45 },
      { id: 3, name: 'Alimento para Aves', count: 25 },
  
    ]);
    
    const brands = ref([
      { id: 1, name: 'Brit', count: 32 }
    ]);
    
    const ratings = ref([
      { value: 4, count: 156 },
      { value: 3, count: 78 },
      { value: 2, count: 34 },
      { value: 1, count: 12 }
    ]);
    
    const products = ref([]);
    
    const selectedSubcategories = ref([]);
    const selectedBrands = ref([]);
    const selectedRatings = ref([]);
    const priceRange = ref({ min: null, max: null });
    const sortOption = ref('relevance');
    const viewMode = ref('grid');
    const currentPage = ref(1);
    const itemsPerPage = 6;
    
    // Cargar productos
    const loadProducts = async () => {
      try {
        // Construir los parámetros de búsqueda
        let query = '';
        let categoriaId = null;
        let marcaId = null;

        // Si hay subcategorías seleccionadas, usar la primera como categoría
        if (selectedSubcategories.value.length > 0) {
          categoriaId = selectedSubcategories.value[0];
        }

        // Si hay marcas seleccionadas, usar la primera
        if (selectedBrands.value.length > 0) {
          marcaId = selectedBrands.value[0];
        }

        const response = await apiService.searchProducts(query, categoriaId, marcaId);
        if (!response.success || !response.data) {
          throw new Error('Respuesta inválida del servidor');
        }
        
        // Transformar los productos para que coincidan con el formato esperado
        products.value = response.data
          .filter(p => p.is_active)
          .map(p => ({
            id: p.id,
            name: p.nombre,
            brand: p.Marca?.nombre || 'Sin marca',
            price: p.precio_unidad,
            originalPrice: null, // Por ahora no manejamos precios originales
            rating: 5, // Por ahora hardcoded hasta implementar sistema de ratings
            reviews: Math.floor(Math.random() * 2000), // Por ahora random hasta implementar sistema de reviews
            image: p.producto_img,
            subcategory: p.Categorium?.id?.toString(),
            brandId: p.Marca?.id?.toString(),
            description: p.descripcion
          }));
      } catch (error) {
        console.error('Error al cargar productos:', error);
        useToast().error('Error al cargar productos', {
          title: 'Error'
        });
      }
    };

    // Observar cambios en los filtros para recargar productos
    watch(
      [selectedSubcategories, selectedBrands],
      () => {
        loadProducts();
      }
    );

    // Productos filtrados
    const filteredProducts = computed(() => {
      let result = [...products.value];
      
      // Filtrar por rating
      if (selectedRatings.value.length > 0) {
        result = result.filter(product => selectedRatings.value.includes(product.rating));
      }
      
      // Filtrar por rango de precio
      if (priceRange.value.min !== null && priceRange.value.max !== null) {
        result = result.filter(product => {
          const price = parseFloat(product.price);
          return price >= parseFloat(priceRange.value.min) && price <= parseFloat(priceRange.value.max);
        });
      }
      
      // Ordenar productos
      switch (sortOption.value) {
        case 'price-asc':
          result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-desc':
          result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
          break;
        case 'newest':
          // En un caso real, ordenaríamos por fecha
          result.reverse();
          break;
        default:
          // Relevancia (por defecto)
          break;
      }
      
      return result;
    });
    
    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredProducts.value.slice(startIndex, endIndex);
    });
    
    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage);
    });
    
    const paginationPages = computed(() => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages.value <= maxVisiblePages) {
        // Mostrar todas las páginas si hay menos que el máximo visible
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        // Lógica para mostrar páginas alrededor de la actual
        let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;
        
        if (endPage > totalPages.value) {
          endPage = totalPages.value;
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    });
    
    const clearFilters = () => {
      selectedSubcategories.value = [];
      selectedBrands.value = [];
      selectedRatings.value = [];
      priceRange.value = { min: null, max: null };
      sortOption.value = 'relevance';
      currentPage.value = 1;
    };
    
    const applyPriceFilter = () => {
      // Validar que min sea menor que max
      if (priceRange.value.min !== null && priceRange.value.max !== null) {
        if (parseFloat(priceRange.value.min) > parseFloat(priceRange.value.max)) {
          // Intercambiar valores
          const temp = priceRange.value.min;
          priceRange.value.min = priceRange.value.max;
          priceRange.value.max = temp;
        }
      }
      
      // Resetear página actual
      currentPage.value = 1;
    };
    
    // Ver detalles del producto
    const viewProductDetails = (product) => {
      router.push({
        path: '/productdetails',
        query: { id: product.id }
      });
    };

    // Agregar al carrito
    const addToCart = (product) => {
      try {
        // Crear el objeto del producto para el carrito
        const cartItem = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: typeof product.price === 'string' 
            ? parseFloat(product.price.replace('$', '').replace(',', '.')) 
            : product.price,
          quantity: 1,
          image: product.image
        };

        // Obtener el carrito actual del localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex !== -1) {
          // Si ya existe, actualizar la cantidad
          cart[existingItemIndex].quantity += 1;
        } else {
          // Si no existe, agregar al carrito
          cart.push(cartItem);
        }
        
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar el contador del carrito en el header
        updateCartCount();
        
        // Mostrar toast de éxito
        toast.success(`${product.name} ha sido agregado exitosamente`, {
          title: 'Producto agregado'
        });
      } catch (error) {
        // Mostrar toast de error
        toast.error(`No se ha podido agregar ${product.name} al carrito`, {
          title: 'Error'
        });
        console.error('Error al agregar al carrito:', error);
      }
    };

    // Actualizar el contador del carrito
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      localStorage.setItem('cartCount', cart.length);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    };

    // Formatear precio
    const formatPrice = (price) => {
      if (typeof price === 'string') {
        return price;
      }
      return `${price.toFixed(2)}$`;
    };
    
    // Inicializar
    onMounted(() => {
      loadProducts();
    });

    return {
      category,
      subcategories,
      brands,
      ratings,
      filteredProducts,
      paginatedProducts,
      selectedSubcategories,
      selectedBrands,
      selectedRatings,
      priceRange,
      sortOption,
      viewMode,
      currentPage,
      totalPages,
      paginationPages,
      clearFilters,
      applyPriceFilter,
      viewProductDetails,
      addToCart,
      formatPrice
    };
  }
};