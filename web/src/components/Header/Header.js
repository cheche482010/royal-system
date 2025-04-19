import { ref, computed, onMounted, onUnmounted, nextTick  } from "vue"
import { useAuth } from "../../composables/useAuth"
import { useRouter } from "vue-router"
import { useCartService } from "../../services/cart.service"
import { useProductsService } from "../../services/products.service" 
import { useDolarService } from "../../services/dolar.service"
import { config } from "../../config/config"
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  ShoppingCartIcon,
  TagIcon,
  PackageIcon,
  ChevronDown,
} from "lucide-vue-next"

export default {
  name: "Header",
  components: {
    SearchIcon,
    BellIcon,
    UserIcon,
    LogInIcon,
    LogOutIcon,
    ShoppingCartIcon,
    TagIcon,
    PackageIcon,
    ChevronDown,
  },
  props: {
    ASSETS: {
      type: Object,
      default: () => config.ASSETS.LOGO
    },
    disableNav: {
      type: Boolean,
      default: false,
    },
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    }
  },
  setup() {
    const router = useRouter()
    const auth = useAuth()
    const cartService = useCartService()
    const cartCount = ref(0)
    const productsService = useProductsService()
    const dolarService = useDolarService()

    // Estado para los menús desplegables
    const showUserMenu = ref(false)
    const showNotifications = ref(false)
    const searchQuery = ref("")
    const searchResults = ref([])
    const showSearchResults = ref(false)
    const isSearching = ref(false)

    // Dollar rate state
    const dollarRate = ref(null)
    const showDollarMenu = ref(false)
    const dollarSource = ref('')
    const dollarLastUpdated = ref(null)
    const dollarId = ref(null)
    const dollarInputValue = ref('')
    const showDollarInput = ref(false)

    // Notificaciones de ejemplo
    const notifications = ref([
      {
        id: 1,
        title: "Pedido confirmado",
        message: "Tu pedido #12345 ha sido confirmado y está en proceso.",
        date: "2023-10-15T14:30:00",
        read: false,
      },
      {
        id: 2,
        title: "Oferta especial",
        message: "¡50% de descuento en productos seleccionados!",
        date: "2023-10-14T09:15:00",
        read: true,
      },
      {
        id: 3,
        title: "Envío en camino",
        message: "Tu pedido #12340 ha sido enviado y llegará pronto.",
        date: "2023-10-13T16:45:00",
        read: false,
      },
    ])

    // Calcular notificaciones no leídas
    const unreadNotifications = computed(() => {
      return notifications.value.filter((notification) => !notification.read).length
    })

    // Formatear fecha para mostrar en notificaciones
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return "Hoy"
      } else if (diffDays === 1) {
        return "Ayer"
      } else if (diffDays < 7) {
        return `Hace ${diffDays} días`
      } else {
        return date.toLocaleDateString()
      }
    }

    // Marcar notificación como leída
    const markAsRead = (id) => {
      const notification = notifications.value.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }
    }

    // Marcar todas como leídas
    const markAllAsRead = () => {
      notifications.value.forEach((notification) => {
        notification.read = true
      })
    }

    // Método para cerrar sesión
    const logout = () => {
      auth.clearUser()
      router.push("/")
      showUserMenu.value = false
    }

    // Método para navegar a una ruta y cerrar el menú
    const navigateTo = (route) => {
      router.push(route)
      showUserMenu.value = false
      showNotifications.value = false
    }

    const searchProducts = async () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        showSearchResults.value = false
        return
      }
    
      isSearching.value = true
      try {
        const isNumericSearch = !isNaN(searchQuery.value)
        
        const results = await productsService.searchProducts(
          isNumericSearch ? '' : searchQuery.value, // query
          null, // categoriaId
          null, // marcaId
          isNumericSearch ? searchQuery.value : null // precio
        )
        
        searchResults.value = results.slice(0, 10)
        showSearchResults.value = true
      } catch (error) {
        console.error("Error searching products:", error)
        searchResults.value = []
      } finally {
        isSearching.value = false
      }
    }

    const navigateToSearchPage = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: "/products",
          query: { search: searchQuery.value }
        })
        searchQuery.value = ""
        searchResults.value = []
        showSearchResults.value = false
      }
    }

    // Cerrar menús al hacer clic fuera de ellos
    const closeMenus = (event) => {
      const userMenuEl = document.querySelector(".user-menu")
      const userInfoEl = document.querySelector(".user-info")
      const notificationMenuEl = document.querySelector(".notification-menu")
      const notificationIconEl = document.querySelector(".notification-icon")
      const searchResultsEl = document.querySelector(".search-results")
      const searchInputEl = document.querySelector(".search-input")
      const dollarMenuEl = document.querySelector(".dollar-menu")
      const dollarRateEl = document.querySelector(".dollar-rate-container")
    
      if (userMenuEl && userInfoEl && !userMenuEl.contains(event.target) && !userInfoEl.contains(event.target)) {
        showUserMenu.value = false
      }
    
      if (
        notificationMenuEl &&
        notificationIconEl &&
        !notificationMenuEl.contains(event.target) &&
        !notificationIconEl.contains(event.target)
      ) {
        showNotifications.value = false
      }
    
      if (
        searchResultsEl &&
        searchInputEl &&
        !searchResultsEl.contains(event.target) &&
        !searchInputEl.contains(event.target)
      ) {
        showSearchResults.value = false
      }
    
      if (
        dollarMenuEl &&
        dollarRateEl &&
        !dollarMenuEl.contains(event.target) &&
        !dollarRateEl.contains(event.target)
      ) {
        showDollarMenu.value = false
        showDollarInput.value = false
      }
    }

    // Actualizar contador del carrito
    const updateCartCount = async () => {
      try {
        if (auth.isAuthenticated.value) {
          // Si el usuario está autenticado, obtener el carrito desde la API
          const cartItems = await cartService.getCartItems()
          cartCount.value = cartItems.length
        } else {
          // Si no está autenticado, obtener el carrito desde localStorage
          const count = localStorage.getItem("cartCount")
          if (count) {
            cartCount.value = parseInt(count, 10)
          } else {
            const cart = JSON.parse(localStorage.getItem("cart")) || []
            cartCount.value = cart.length
          }
        }
      } catch (error) {
        console.error("Error al actualizar contador del carrito:", error)
        // En caso de error, intentar obtener el contador desde localStorage
        const count = localStorage.getItem("cartCount")
        if (count) {
          cartCount.value = parseInt(count, 10)
        }
      }
    }

    // Escuchar evento de actualización del carrito
    const handleCartUpdated = () => {
      // Actualizar el contador del carrito inmediatamente
      updateCartCount()
    }

    // Agregar event listeners
    onMounted(() => {
      document.addEventListener("click", closeMenus)
      window.addEventListener("cart-updated", handleCartUpdated)

      // Inicializar contador del carrito
      updateCartCount()
      getCurrentDollarRate()
    })

    // Limpiar event listeners
    onUnmounted(() => {
      document.removeEventListener("click", closeMenus)
      window.removeEventListener("cart-updated", handleCartUpdated)
    })

    const categories = ref([
      { id: 1, name: "Item I" },
      { id: 2, name: "Item II" },
      { id: 3, name: "Item III" },
      { id: 4, name: "Item IV" },
    ])

    const formatPrice = (price) => {
      if (typeof price === 'number') {
        return `$${price.toFixed(2)}`
      }
      if (typeof price === 'string') {
        // Si ya tiene formato, devolverlo tal cual
        if (price.includes('$')) return price
        // Si es un número en string, formatearlo
        const num = parseFloat(price)
        if (!isNaN(num)) return `$${num.toFixed(2)}`
      }
      return price 
    }

    const getCurrentDollarRate = async () => {
      try {
        const rateData = await dolarService.getMostRecentDollarRate()
        
        if (rateData) {
          dollarRate.value = rateData.rate
          dollarSource.value = rateData.source
          dollarLastUpdated.value = rateData.updatedAt
          dollarId.value = rateData.id || null
        } else {
          dollarRate.value = null
          dollarSource.value = 'No disponible'
          dollarLastUpdated.value = null
        }
      } catch (error) {
        console.error('Error getting dollar rate:', error)
        dollarRate.value = null
        dollarSource.value = 'Error al obtener tasa'
        dollarLastUpdated.value = null
      }
    }

    // Add new rate to DB
    const addNewDollarRate = async () => {
      if (!dollarInputValue.value) return
      
      try {
        const rate = parseFloat(dollarInputValue.value)
        if (isNaN(rate)) {
          alert('Por favor ingrese un valor numérico válido')
          return
        }

        await dolarService.createExchangeRate(rate)
        dollarInputValue.value = ''
        showDollarInput.value = false
        await getCurrentDollarRate()
      } catch (error) {
        console.error('Error adding new dollar rate:', error)
        alert('Error al agregar nueva tasa')
      }
    }

    const startAddingNewRate = () => {
      showDollarInput.value = true
      dollarInputValue.value = dollarRate.value?.toFixed(2) || ''

      nextTick(() => {
        const input = document.querySelector('.dollar-input')
        if (input) input.focus()
      })
    }

    return {
      cartCount,
      categories,
      isAuthenticated: auth.isAuthenticated,
      userName: auth.userName,
      logout,
      navigateTo,
      showUserMenu,
      showNotifications,
      notifications,
      unreadNotifications,
      formatDate,
      markAsRead,
      markAllAsRead,
      searchQuery,
      searchResults,
      showSearchResults,
      isSearching,
      searchProducts,
      navigateToSearchPage,
      formatPrice,
      dollarRate: computed(() => dollarRate.value ? `${dollarRate.value.toFixed(2)} BS` : '--.-- BS'),
      showDollarMenu,
      addNewDollarRate,
      startAddingNewRate,
      dollarSource,
      dollarLastUpdated,
      dollarInputValue,
      showDollarInput,
    }
  },
}