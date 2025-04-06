"use client"

import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"
import { useToast } from "../../services/toast.service"
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.vue"
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon, LockIcon } from "lucide-vue-next"

export default {
  name: "Cart",
  components: {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    LockIcon,
    Header,
    Footer,
    ProductCarousel,
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const cartService = useCartService()

    // Carrito de items
    const cartItems = ref([])

    const featuredProducts = ref([])
    const promoCode = ref("")
    const appliedPromo = ref(null)

    const subtotal = computed(() => {
      const total = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return formatPrice(total)
    })

    const shipping = computed(() => {
      const subtotalValue = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return subtotalValue >= 59 ? "Gratis" : formatPrice(4.99)
    })

    const discount = computed(() => {
      if (!appliedPromo.value) return null

      const subtotalValue = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const discountAmount = subtotalValue * (appliedPromo.value.percentage / 100)
      return formatPrice(discountAmount)
    })

    const total = computed(() => {
      let totalValue = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Aplicar descuento si hay un código promocional
      if (appliedPromo.value) {
        totalValue -= totalValue * (appliedPromo.value.percentage / 100)
      }

      // Añadir gastos de envío si es necesario
      if (totalValue < 59) {
        totalValue += 4.99
      }

      return formatPrice(totalValue)
    })

    const formatPrice = (price) => {
      return `${price.toFixed(2).replace(".", ",")}$`
    }

    const updateQuantity = async (itemId, newQuantity) => {
      if (newQuantity < 1) return

      try {
        // Actualizar la cantidad en el servidor
        await cartService.updateCartItemQuantity(itemId, newQuantity)

        // Actualizar la UI
        const itemIndex = cartItems.value.findIndex((item) => item.id === itemId)
        if (itemIndex !== -1) {
          cartItems.value[itemIndex].quantity = newQuantity
        }

        toast.success("Cantidad actualizada", {
          title: "Carrito actualizado",
        })
      } catch (error) {
        console.error("Error al actualizar cantidad:", error)
        toast.error("Error al actualizar cantidad", {
          title: "Error",
        })
      }
    }

    const removeItem = async (itemId) => {
      try {
        // Eliminar el item del servidor
        await cartService.removeFromCart(itemId)

        // Actualizar la UI
        cartItems.value = cartItems.value.filter((item) => item.id !== itemId)

        toast.success("Producto eliminado del carrito", {
          title: "Carrito actualizado",
        })
      } catch (error) {
        console.error("Error al eliminar item:", error)
        toast.error("Error al eliminar producto", {
          title: "Error",
        })
      }
    }

    const checkout = () => {
      router.push("/payment")
    }

    const loadCartItems = async () => {
      try {
        // Obtener los items del carrito desde el servidor
        const items = await cartService.getCartItems()
        cartItems.value = items
      } catch (error) {
        console.error("Error al cargar el carrito:", error)
        toast.error("Error al cargar el carrito", {
          title: "Error",
        })
      }
    }

    const loadFeaturedProducts = async () => {
      try {
        const response = await apiService.getAllProducts()
        if (!response.success || !response.data) {
          throw new Error("Respuesta inválida del servidor")
        }

        // Tomar los primeros 5 productos activos como destacados
        featuredProducts.value = response.data
          .filter((p) => p.is_active)
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            name: p.nombre,
            brand: p.Marca?.nombre || "Sin marca",
            price: p.precio_unidad,
            image: p.producto_img,
          }))
      } catch (error) {
        console.error("Error al cargar productos destacados:", error)
        toast.error("Error al cargar productos destacados", {
          title: "Error",
        })
      }
    }

    // Escuchar evento de actualización del carrito
    const handleCartUpdated = () => {
      // Recargar los items del carrito cuando se actualiza
      loadCartItems()
    }

    // Inicializar
    onMounted(() => {
      // Cargar datos iniciales
      loadCartItems()
      loadFeaturedProducts()

      // Agregar listener para actualizar carrito cuando se agrega un producto
      window.addEventListener("cart-updated", handleCartUpdated)
    })

    // Limpiar event listeners
    onUnmounted(() => {
      window.removeEventListener("cart-updated", handleCartUpdated)
    })

    return {
      cartItems,
      promoCode,
      subtotal,
      shipping,
      discount,
      total,
      featuredProducts,
      formatPrice,
      updateQuantity,
      removeItem,
      checkout,
    }
  },
}

