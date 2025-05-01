import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRouter } from "vue-router"
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, EyeIcon, ShoppingCartIcon } from "lucide-vue-next"
import { useToast } from "../../services/toast.service"
import { useCartService } from "../../services/cart.service"
import { useDolarStore } from '../../stores/dolar'
import { config } from '../../config/config'

export default {
  name: "ProductCarousel",
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    StarIcon,
    EyeIcon,
    ShoppingCartIcon,
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    },
    products: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const router = useRouter()
    const toast = useToast()
    const cartService = useCartService()
    const carouselTrack = ref(null)
    const scrollPosition = ref(0)
    const maxScrollPosition = ref(0)
    const dolarStore = useDolarStore()
    const dollarRate = computed(() => dolarStore.dollarRate)

    // Calcular la posición máxima de scroll
    const calculateMaxScrollPosition = () => {
      if (!carouselTrack.value) return 0
      return carouselTrack.value.scrollWidth - carouselTrack.value.clientWidth
    }

    // Actualizar la posición de scroll
    const updateScrollPosition = () => {
      if (!carouselTrack.value) return
      scrollPosition.value = carouselTrack.value.scrollLeft
      maxScrollPosition.value = calculateMaxScrollPosition()
    }

    // Desplazar a la izquierda
    const scrollLeft = () => {
      if (!carouselTrack.value) return

      const scrollAmount = carouselTrack.value.clientWidth * 0.8 
      carouselTrack.value.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }

    // Desplazar a la derecha
    const scrollRight = () => {
      if (!carouselTrack.value) return

      const scrollAmount = carouselTrack.value.clientWidth * 0.8
      carouselTrack.value.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
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
        if (!cartService.isAuthenticated()) {
          toast.error("Debes iniciar sesión para agregar productos al carrito", {
            title: "Acceso denegado",
          })

          router.push("/login")
          return
        }

        const result = await cartService.addToCart(product, 1)

        if (result.alreadyInCart) {
          toast.info(`${product.name} ya está en tu carrito`, {
            title: "Producto en carrito",
          })
        } else if (result.success) {
          toast.success(`${product.name} ha sido agregado exitosamente`, {
            title: "Producto agregado",
          })
        } else if (result.authenticated === false) {
          toast.error("Debes iniciar sesión para agregar productos al carrito", {
            title: "Acceso denegado",
          })

          router.push("/login")
        } else {
          throw new Error(result.message || "Error al agregar al carrito")
        }
      } catch (error) {
        toast.error(`No se ha podido agregar ${product.name} al carrito`, {
          title: "Error",
        })
        console.error("Error al agregar al carrito:", error)
      }
    }

    const formatPrice = (price) => {
      if (typeof price === "string") {
        return price
      }
      return `${price.toFixed(2)}$`
    }

    const handleScroll = () => {
      updateScrollPosition()
    }

    onMounted(() => {
      updateScrollPosition()

      if (carouselTrack.value) {
        carouselTrack.value.addEventListener("scroll", handleScroll)
      }

      maxScrollPosition.value = calculateMaxScrollPosition()

      window.addEventListener("resize", () => {
        maxScrollPosition.value = calculateMaxScrollPosition()
      })
    })

    onUnmounted(() => {
      if (carouselTrack.value) {
        carouselTrack.value.removeEventListener("scroll", handleScroll)
      }
      window.removeEventListener("resize", () => {
        maxScrollPosition.value = calculateMaxScrollPosition()
      })
    })

    const formatPriceBs = (price) => {
      const rate = dollarRate.value?._value || dollarRate.value
      
      const numericPrice = typeof price === 'string'
        ? parseFloat(price.replace(',', '.'))
        : Number(price)

      if (!rate || isNaN(numericPrice)) {
        return '--.-- BS'
      }

      const totalBs = (numericPrice * Number(rate).toFixed(2)).toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' BS'

      return totalBs
    }

    return {
      carouselTrack,
      scrollPosition,
      maxScrollPosition,
      scrollLeft,
      scrollRight,
      viewProductDetails,
      addToCart,
      formatPrice,
      formatPriceBs,
      dollarRate
    }
  },
}

