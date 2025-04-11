
"use client"

import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRouter } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"
import { useCouponService } from "../../services/coupon.service"
import { useToast } from "../../services/toast.service"
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.vue"
import { config } from "../../config/config"

import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon, 
  ShoppingCartIcon, 
  LockIcon, 
  TagIcon 
} from "lucide-vue-next"

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
    TagIcon,
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
    const couponService = useCouponService()

    // Carrito de items
    const cartItems = ref([])
    const isCartEmpty = computed(() => cartItems.value.length === 0)

    const featuredProducts = ref([])
    const promoCode = ref("")
    const appliedPromo = ref(null)
    const couponError = ref("")

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

      if (appliedPromo.value) {
        totalValue -= totalValue * (appliedPromo.value.percentage / 100)
      }

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
        
        await cartService.updateCartItemQuantity(itemId, newQuantity)

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
        
        const result = await cartService.removeFromCart(itemId)

        if (result.success) {
         
          cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
          cartService.updateCartCount(cartItems.value.length)
          cartService.notifyCartUpdated()
          
          toast.success("Producto eliminado del carrito", {
            title: "Carrito actualizado",
          })
          
          // Si el carrito está vacío, redirigir a la página principal
          if (cartItems.value.length === 0) {
            // Opcional: redirigir a la página principal o mostrar un mensaje
            // router.push("/")
          }
        } else {
          throw new Error(result.message || "Error al eliminar producto")
        }
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

        featuredProducts.value = response.data
          .filter((p) => p.is_active)
          .slice(0, 8)
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

    const applyPromoCode = async () => {
      if (!promoCode.value) {
        couponError.value = "Por favor ingresa un código promocional"
        return
      }
    
      try {
        const result = await couponService.validateCoupon(promoCode.value)
        
        if (result.success) {
          appliedPromo.value = {
            code: promoCode.value,
            percentage: result.data.descuento,
            type: result.data.tipo_descuento
          }
          couponError.value = ""
          toast.success("Cupón aplicado correctamente")
        } else {
          couponError.value = result.message
          appliedPromo.value = null
        }
      } catch (error) {
        console.error("Error al aplicar cupón:", error)
        couponError.value = "Error al aplicar cupón"
      }
    }

    const removePromoCode = () => {
      appliedPromo.value = null
      promoCode.value = ""
      couponError.value = ""
    }

    const handleCartUpdated = () => {
      loadCartItems()
    }

    onMounted(() => {
      loadCartItems()
      loadFeaturedProducts()
      window.addEventListener("cart-updated", handleCartUpdated)
    })

    onUnmounted(() => {
      window.removeEventListener("cart-updated", handleCartUpdated)
    })

    watch(cartItems, (newItems) => {
      cartService.updateCartCount(newItems.length)
    }, { deep: true })

    return {
      cartItems,
      isCartEmpty,
      promoCode,
      subtotal,
      shipping,
      discount,
      total,
      featuredProducts,
      appliedPromo,
      couponError,
      formatPrice,
      updateQuantity,
      removeItem,
      checkout,
      applyPromoCode,
      removePromoCode,
    }
  },
}
