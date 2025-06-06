import { ref, computed, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"
import { config } from '../../config/config'
import { useAuth } from "../../composables/useAuth"
import { useToast } from "../../services/toast.service"
import { useProductsService } from "../../services/products.service"
import { useDolarStore } from '../../stores/dolar'

import { 
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  LockIcon,
  Search,
  CheckCircle
} from "lucide-vue-next"

export default {
  name: "ProductDetails",
  components: {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    LockIcon,
    Search,
    CheckCircle,
    Header,
    Footer,
    ProductCarousel,
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuth()
    const toast = useToast()
    const cartService = useCartService()
    const productsService = useProductsService()
    const dolarStore = useDolarStore()
    const dollarRate = computed(() => dolarStore.dollarRate)

    // Estado para la cantidad
    const quantity = ref(1)

    // Estado para el zoom de imagen
    const showZoom = ref(false)

    // Estado para la imagen seleccionada
    const selectedImageIndex = ref(0)

    // Estado para la carga y errores
    const loading = ref(true)
    const error = ref(null)

    // Estado del producto
    const productItems = ref(null)

    // Productos relacionados
    const relatedProductsdetails = ref([])

    
    onMounted(() => {
      loadProductDetails()
    })

    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadProductDetails()
        }
      },
    )

    const loadProductDetails = async () => {
      loading.value = true
      error.value = null

      try {
        const productId = route.query.id
        if (!productId) {
          error.value = "ID de producto no encontrado"
          return
        }

        const response = await apiService.getProductById(productId)

        if (!response || !response.data) {
          throw new Error("No se pudo cargar el producto")
        }

        const data = response.data

        productItems.value = {
          id: data.id,
          name: data.nombre,
          brand: data.Marca?.nombre || "Sin marca",
          marca_id: data.marca_id,
          categoria: data.Categorium?.nombre || data.Categoria?.nombre || "Sin categoría",
          categoria_id: data.categoria_id,
          price: Number.parseFloat(data.precio_unidad),
          description: data.descripcion,
          quantity: 1,
          inventory: Number.parseInt(data.Inventario?.cantidad_actual || 0),
          images: [data.producto_img],
        } 

        const query = ""
        let categoriaId = null
        let marcaId = null

        const productsResponse = await apiService.searchProducts(query, categoriaId, marcaId)
        if (!productsResponse.success || !productsResponse.data) {
          throw new Error("Respuesta inválida del servidor")
        }

        relatedProductsdetails.value = productsResponse.data
          .filter((p) => p.is_active && p.Inventario)
          .map((p) => ({
            id: p.id,
            name: p.nombre,
            brand: p.Marca?.nombre || "Sin marca",
            price: p.precio_unidad,
            image: p.producto_img,
            subcategory: p.Categorium?.id?.toString(),
            brandId: p.Marca?.id?.toString(),
            description: p.descripcion,
            inventario: p.Inventario,
            isOutOfStock: p.Inventario.cantidad_actual === 0 || p.Inventario.estado === "Agotado",
            stockStatus: p.Inventario.estado,
            stockQuantity: p.Inventario.cantidad_actual,
          }))
      } catch (err) {
        console.error("Error al cargar el producto:", err)
        error.value = err.message
        toast.error("Error al cargar el producto")
      } finally {
        loading.value = false
      }
    }

    const totalPrice = computed(() => {
      if (!productItems.value) return formatPrice(0)
      return formatPrice(productItems.value.price * quantity.value)
    })
    
    const totalPriceBs = computed(() => {
      if (!productItems.value) return formatPriceBs(0)
      return formatPriceBs(productItems.value.price * quantity.value)
    })

    const currentImage = computed(() => {
      if (!productItems.value || !productItems.value.images) return ""
      return productItems.value.images[selectedImageIndex.value]
    })

    const updateQuantity = (newQuantity) => {
      if (newQuantity < 1) return
      quantity.value = newQuantity
    }

    const increaseQuantity = () => {
      quantity.value++
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const selectImage = (index) => {
      selectedImageIndex.value = index
    }

    const toggleZoom = () => {
      showZoom.value = !showZoom.value
    }

    const closeZoom = (event) => {
      if (event.target.classList.contains("zoom-overlay")) {
        showZoom.value = false
      }
    }

    const addToCart = async () => {
      try {
        if (!productItems.value) {
          toast.error("No se ha podido agregar el producto al carrito: Producto no disponible")
          return
        }

        if (!cartService.isAuthenticated()) {
          toast.error("Debes iniciar sesión para agregar productos al carrito", {
            title: "Acceso denegado",
          })

          router.push("/login")
          return
        }

        const result = await cartService.addToCart(productItems.value, quantity.value)

        if (result.alreadyInCart) {
          toast.info(`${productItems.value.name} ya está en tu carrito`, {
            title: "Producto en carrito",
          })
        } else if (result.success) {
         toast.success(`${productItems.value.name} ha sido agregado exitosamente`, {
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
        toast.error(`No se ha podido agregar el producto al carrito`, {
          title: "Error",
        })
        console.error("Error al agregar al carrito:", error)
      }
    }

    watch(
      () => route.query.id,
      (newId) => {
        if (newId) {
          loadProductDetails()
        }
      },
      { immediate: true },
    )

    onMounted(() => {
      loadProductDetails()
    })

    const formatPrice = (price) => {
      if (typeof price === 'string') return price
      return `${price.toFixed(2).replace(".", ",")}$`
    }

    const formatPriceBs = (price) => {
      const rate = dollarRate.value?._value || dollarRate.value 
      const numericPrice = typeof price === 'string' 
        ? parseFloat(price.replace(',', '.')) 
        : Number(price)
      
      if (!rate || isNaN(numericPrice)) return '--.-- BS'
      
      return (numericPrice * Number(rate).toFixed(2)).toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' BS'
    }

    return {
      productItems,
      relatedProductsdetails,
      quantity,
      totalPrice,
      currentImage,
      selectedImageIndex,
      showZoom,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      selectImage,
      toggleZoom,
      closeZoom,
      addToCart,
      totalPriceBs,
      formatPrice,
      formatPriceBs,
      dollarRate
    }
  },
}

