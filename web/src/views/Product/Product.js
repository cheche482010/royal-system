  import { ref, computed } from 'vue';
  import Header from '../../components/Header/Header.vue';
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
  } from 'lucide-vue-next';
  
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
      Header
    },
    setup() {
      const category = ref({
        id: 'perros',
        name: 'Productos para Perros',
        description: 'Todo lo que necesitas para el cuidado y bienestar de tu perro'
      });
      
      const subcategories = ref([
        { id: 'alimentacion', name: 'Alimentación', count: 245 },
        { id: 'antiparasitarios', name: 'Antiparasitarios', count: 78 },
        { id: 'higiene', name: 'Higiene y Cuidado', count: 124 },
        { id: 'juguetes', name: 'Juguetes', count: 93 },
        { id: 'accesorios', name: 'Accesorios', count: 156 }
      ]);
      
      const brands = ref([
        { id: 'royal-canin', name: 'Royal Canin', count: 45 },
        { id: 'seresto', name: 'Seresto', count: 12 },
        { id: 'frontline', name: 'Frontline', count: 18 },
        { id: 'scalibor', name: 'Scalibor', count: 8 },
        { id: 'advance', name: 'Advance', count: 32 }
      ]);
      
      const ratings = ref([
        { value: 4, count: 156 },
        { value: 3, count: 78 },
        { value: 2, count: 34 },
        { value: 1, count: 12 }
      ]);
      
      const products = ref([
        {
          id: 1,
          name: 'Collar Antiparasitario para Perros Pequeño - 8 Kg',
          brand: 'Seresto',
          price: '36,49€',
          originalPrice: '42,99€',
          rating: 5,
          reviews: 2004,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'antiparasitarios',
          brandId: 'seresto',
          description: 'Collar antiparasitario de larga duración para perros pequeños. Protección contra pulgas y garrapatas durante 8 meses.',
          badges: [
            { type: 'discount', text: '-15%' }
          ]
        },
        {
          id: 2,
          name: 'Collar Antiparasitario para Perros 48 cm',
          brand: 'Scalibor',
          price: '27,15€',
          rating: 5,
          reviews: 1544,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'antiparasitarios',
          brandId: 'scalibor',
          description: 'Collar antiparasitario para perros de todos los tamaños. Protección contra pulgas, garrapatas y flebotomos durante 12 meses.'
        },
        {
          id: 3,
          name: 'Pipetas Tri-Act Solución Spot-On para Perros de 20-40 Kg 3 Pipetas',
          brand: 'Frontline',
          price: '30,89€',
          rating: 5,
          reviews: 283,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'antiparasitarios',
          brandId: 'frontline',
          description: 'Pipetas antiparasitarias para perros medianos. Protección contra pulgas, garrapatas, mosquitos y flebotomos.'
        },
        {
          id: 4,
          name: 'Pienso para perros adultos Medium Adult',
          brand: 'Royal Canin',
          price: '47,46€',
          originalPrice: '52,99€',
          rating: 5,
          reviews: 1876,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'alimentacion',
          brandId: 'royal-canin',
          description: 'Alimento completo y equilibrado para perros adultos de razas medianas. Formulado para mantener un peso saludable y favorecer la digestión.',
          badges: [
            { type: 'discount', text: '-10%' }
          ]
        },
        {
          id: 5,
          name: 'Champú para perros de pelo largo',
          brand: 'TropiClean',
          price: '14,50€',
          rating: 4,
          reviews: 342,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'higiene',
          brandId: 'tropiclean',
          description: 'Champú especial para perros de pelo largo. Limpia en profundidad y facilita el cepillado, dejando el pelo suave y brillante.'
        },
        {
          id: 6,
          name: 'Juguete para perros Kong Classic',
          brand: 'Kong',
          price: '12,99€',
          rating: 5,
          reviews: 2145,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'juguetes',
          brandId: 'kong',
          description: 'Juguete resistente de caucho para perros. Ideal para masticar, jugar y rellenar con premios. Ayuda a reducir el aburrimiento y la ansiedad.'
        },
        {
          id: 7,
          name: 'Cama para perros Deluxe Ortopédica',
          brand: 'PetComfort',
          price: '39,95€',
          originalPrice: '49,95€',
          rating: 4,
          reviews: 567,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'accesorios',
          brandId: 'petcomfort',
          description: 'Cama ortopédica para perros con espuma viscoelástica. Proporciona soporte y alivio para articulaciones y músculos, especialmente en perros mayores.',
          badges: [
            { type: 'discount', text: '-20%' }
          ]
        },
        {
          id: 8,
          name: 'Pienso para perros adultos Sensitive',
          brand: 'Advance',
          price: '42,75€',
          rating: 4,
          reviews: 892,
          image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=200&width=200',
          subcategory: 'alimentacion',
          brandId: 'advance',
          description: 'Alimento especial para perros con sensibilidad digestiva o cutánea. Formulado con ingredientes seleccionados para minimizar las reacciones alérgicas.'
        }
      ]);
      
      const selectedSubcategories = ref([]);
      const selectedBrands = ref([]);
      const selectedRatings = ref([]);
      const priceRange = ref({ min: null, max: null });
      const sortOption = ref('relevance');
      const viewMode = ref('grid');
      const currentPage = ref(1);
      const itemsPerPage = 6;
      
      const filteredProducts = computed(() => {
        let result = [...products.value];
        
        // Filtrar por subcategorías
        if (selectedSubcategories.value.length > 0) {
          result = result.filter(product => selectedSubcategories.value.includes(product.subcategory));
        }
        
        // Filtrar por marcas
        if (selectedBrands.value.length > 0) {
          result = result.filter(product => selectedBrands.value.includes(product.brandId));
        }
        
        // Filtrar por valoración
        if (selectedRatings.value.length > 0) {
          result = result.filter(product => selectedRatings.value.includes(product.rating));
        }
        
        // Filtrar por precio
        if (priceRange.value.min !== null) {
          const minPrice = parseFloat(priceRange.value.min);
          result = result.filter(product => {
            const productPrice = parseFloat(product.price.replace('€', '').replace(',', '.'));
            return productPrice >= minPrice;
          });
        }
        
        if (priceRange.value.max !== null) {
          const maxPrice = parseFloat(priceRange.value.max);
          result = result.filter(product => {
            const productPrice = parseFloat(product.price.replace('€', '').replace(',', '.'));
            return productPrice <= maxPrice;
          });
        }
        
        // Ordenar productos
        switch (sortOption.value) {
          case 'price-asc':
            result.sort((a, b) => {
              const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
              const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
              return priceA - priceB;
            });
            break;
          case 'price-desc':
            result.sort((a, b) => {
              const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
              const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
              return priceB - priceA;
            });
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
      
      const addToCart = (product) => {
        // Aquí iría la lógica para añadir al carrito
        console.log('Añadiendo al carrito:', product);
      };
      
      return {
        category,
        subcategories,
        brands,
        ratings,
        filteredProducts,
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
        addToCart
      };
    }
  };