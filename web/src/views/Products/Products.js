"use client"

import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"
import { config } from '../../config/config'
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
  EyeIcon,
} from "lucide-vue-next"
import { useToast } from "../../services/toast.service"

export default {
  name: "Products",
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
    Footer,
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    }
  },
  setup(props) {
    const router = useRouter()
    const toast = useToast()
    const cartService = useCartService()
    const category = ref({
      id: "perros",
      name: "Productos para Perros",
      description: "Todo lo que necesitas para el cuidado y bienestar de tu perro",
    })

    const subcategories = ref([
      { id: 1, name: "Alimento para Gatos", count: 24 },
      { id: 2, name: "Alimento para Perros", count: 45 },
      { id: 3, name: "Alimento para Aves", count: 25 },
    ])

    const brands = ref([{ id: 1, name: "Brit", count: 32 }])

    const ratings = ref([
      { value: 4, count: 156 },
      { value: 3, count: 78 },
      { value: 2, count: 34 },
      { value: 1, count: 12 },
    ])

    const products = ref([])

    const selectedSubcategories = ref([])
    const selectedBrands = ref([])
    const selectedRatings = ref([])
    const priceRange = ref({ min: null, max: null })
    const sortOption = ref("relevance")
    const viewMode = ref("grid")
    const currentPage = ref(1)
    const itemsPerPage = 6

    // Cargar productos
    const loadProducts = async () => {
      try {
        // Construir los parámetros de búsqueda
        const query = ""
        let categoriaId = null
        let marcaId = null

        // Si hay subcategorías seleccionadas, usar la primera como categoría
        if (selectedSubcategories.value.length > 0) {
          categoriaId = selectedSubcategories.value[0]
        }

        // Si hay marcas seleccionadas, usar la primera
        if (selectedBrands.value.length > 0) {
          marcaId = selectedBrands.value[0]
        }

        const response = await apiService.searchProducts(query, categoriaId, marcaId)
        if (!response.success || !response.data) {
          throw new Error("Respuesta inválida del servidor")
        }

        // Transformar los productos para que coincidan con el formato esperado
        products.value = response.data
          .filter((p) => p.is_active)
          .map((p) => ({
            id: p.id,
            name: p.nombre,
            brand: p.Marca?.nombre || "Sin marca",
            price: p.precio_unidad,
            originalPrice: null, // Por ahora no manejamos precios originales
            rating: 5, // Por ahora hardcoded hasta implementar sistema de ratings
            reviews: Math.floor(Math.random() * 2000), // Por ahora random hasta implementar sistema de reviews
            image: p.producto_img,
            subcategory: p.Categorium?.id?.toString(),
            brandId: p.Marca?.id?.toString(),
            description: p.descripcion,
          }))
      } catch (error) {
        console.error("Error al cargar productos:", error)
        toast.error("Error al cargar productos", {
          title: "Error",
        })
      }
    }

    // Observar cambios en los filtros para recargar productos
    watch([selectedSubcategories, selectedBrands], () => {
      loadProducts()
    })

    // Productos filtrados
    const filteredProducts = computed(() => {
      let result = [...products.value]

      // Filtrar por rating
      if (selectedRatings.value.length > 0) {
        result = result.filter((product) => selectedRatings.value.includes(product.rating))
      }

      // Filtrar por rango de precio
      if (priceRange.value.min !== null && priceRange.value.max !== null) {
        result = result.filter((product) => {
          const price = Number.parseFloat(product.price)
          return price >= Number.parseFloat(priceRange.value.min) && price <= Number.parseFloat(priceRange.value.max)
        })
      }

      // Ordenar productos
      switch (sortOption.value) {
        case "price-asc":
          result.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
          break
        case "price-desc":
          result.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
          break
        case "rating":
          result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
          break
        case "newest":
          // En un caso real, ordenaríamos por fecha
          result.reverse()
          break
        default:
          // Relevancia (por defecto)
          break
      }

      return result
    })

    const paginatedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      return filteredProducts.value.slice(startIndex, endIndex)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage)
    })

    const paginationPages = computed(() => {
      const pages = []
      const maxVisiblePages = 5

      if (totalPages.value <= maxVisiblePages) {
        // Mostrar todas las páginas si hay menos que el máximo visible
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        // Lógica para mostrar páginas alrededor de la actual
        let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
        let endPage = startPage + maxVisiblePages - 1

        if (endPage > totalPages.value) {
          endPage = totalPages.value
          startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
      }

      return pages
    })

    const clearFilters = () => {
      selectedSubcategories.value = []
      selectedBrands.value = []
      selectedRatings.value = []
      priceRange.value = { min: null, max: null }
      sortOption.value = "relevance"
      currentPage.value = 1
    }

    const applyPriceFilter = () => {
      // Validar que min sea menor que max
      if (priceRange.value.min !== null && priceRange.value.max !== null) {
        if (Number.parseFloat(priceRange.value.min) > Number.parseFloat(priceRange.value.max)) {
          // Intercambiar valores
          const temp = priceRange.value.min
          priceRange.value.min = priceRange.value.max
          priceRange.value.max = temp
        }
      }

      // Resetear página actual
      currentPage.value = 1
    }

    // Ver detalles del producto
    const viewProductDetails = (product) => {
      router.push({
        path: "/productdetails",
        query: { id: product.id },
      })
    }

    // Agregar al carrito
    const addToCart = async (product) => {
      try {
        // Verificar si el usuario está autenticado
        if (!cartService.isAuthenticated()) {
          // Si no está autenticado, mostrar mensaje y redirigir a login
          toast.error("Debes iniciar sesión para agregar productos al carrito", {
            title: "Acceso denegado",
          })

          // Opcional: redirigir al usuario a la página de login
          router.push("/login")
          return
        }

        // Usar el servicio de carrito para agregar el producto
        const result = await cartService.addToCart(product, 1)

        if (result.alreadyInCart) {
          // Si el producto ya está en el carrito, mostrar un mensaje diferente
          toast.info(`${product.name} ya está en tu carrito`, {
            title: "Producto en carrito",
          })
        } else if (result.success) {
          // Si se agregó correctamente, mostrar mensaje de éxito
          toast.success(`${product.name} ha sido agregado exitosamente`, {
            title: "Producto agregado",
          })
        } else if (result.authenticated === false) {
          // Si no está autenticado, mostrar mensaje y redirigir a login
          toast.error("Debes iniciar sesión para agregar productos al carrito", {
            title: "Acceso denegado",
          })

          // Opcional: redirigir al usuario a la página de login
          router.push("/login")
        } else {
          // Si hubo un error, mostrar mensaje de error
          throw new Error(result.message || "Error al agregar al carrito")
        }
      } catch (error) {
        // Mostrar toast de error
        toast.error(`No se ha podido agregar ${product.name} al carrito`, {
          title: "Error",
        })
        console.error("Error al agregar al carrito:", error)
      }
    }

    // Formatear precio
    const formatPrice = (price) => {
      if (typeof price === "string") {
        return price
      }
      return `${price.toFixed(2)}$`
    }

    // Inicializar
    onMounted(() => {
      loadProducts()
    })

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
      formatPrice,
      toast,
    }
  },
}

