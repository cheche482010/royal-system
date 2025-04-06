"use client"

import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, EyeIcon, ShoppingCartIcon } from "lucide-vue-next"
import { useToast } from "../../services/toast.service"
import { useCartService } from "../../services/cart.service"

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

      const scrollAmount = carouselTrack.value.clientWidth * 0.8 // Desplazar 80% del ancho visible
      carouselTrack.value.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }

    // Desplazar a la derecha
    const scrollRight = () => {
      if (!carouselTrack.value) return

      const scrollAmount = carouselTrack.value.clientWidth * 0.8 // Desplazar 80% del ancho visible
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

    // Manejar el evento de scroll
    const handleScroll = () => {
      updateScrollPosition()
    }

    onMounted(() => {
      // Inicializar posiciones de scroll
      updateScrollPosition()

      // Agregar listener para actualizar posición al hacer scroll
      if (carouselTrack.value) {
        carouselTrack.value.addEventListener("scroll", handleScroll)
      }

      // Calcular posición máxima inicial
      maxScrollPosition.value = calculateMaxScrollPosition()

      // Recalcular cuando cambia el tamaño de la ventana
      window.addEventListener("resize", () => {
        maxScrollPosition.value = calculateMaxScrollPosition()
      })
    })

    onUnmounted(() => {
      // Limpiar event listeners
      if (carouselTrack.value) {
        carouselTrack.value.removeEventListener("scroll", handleScroll)
      }
      window.removeEventListener("resize", () => {
        maxScrollPosition.value = calculateMaxScrollPosition()
      })
    })

    return {
      carouselTrack,
      scrollPosition,
      maxScrollPosition,
      scrollLeft,
      scrollRight,
      viewProductDetails,
      addToCart,
      formatPrice,
    }
  },
}

