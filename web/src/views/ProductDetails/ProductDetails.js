"use client"

import { ref, computed, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"

import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon, LockIcon, Search, CheckCircle } from "lucide-vue-next"
import { useAuth } from "../../composables/useAuth"
import { useToast } from "../../services/toast.service"

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
  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuth()
    const toast = useToast()
    const cartService = useCartService()

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

    // Cargar el producto cuando el componente se monta
    onMounted(() => {
      console.log("Component mounted, loading product...")
      loadProductDetails()
    })

    // Recargar cuando cambia la ruta
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          console.log("Route changed, reloading product...")
          loadProductDetails()
        }
      },
    )

    // Cargar el producto seleccionado
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
        console.log("Product Response:", response)

        if (!response || !response.data) {
          throw new Error("No se pudo cargar el producto")
        }

        const data = response.data
        console.log("Product Data:", data)

        // Transformar el producto al formato esperado
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

        // Cargar productos para el carousel (generales por ahora)
        const productsResponse = await apiService.getAllProducts()

        console.log("All Products Response:", productsResponse)

        if (productsResponse?.data) {
          relatedProductsdetails.value = productsResponse.data
            .filter((p) => p.id !== data.id)
            .slice(0, 8)
            .map((p) => ({
              id: p.id,
              name: p.nombre,
              brand: p.Marca?.nombre || "Sin marca",
              price: Number.parseFloat(p.precio_unidad),
              image: p.producto_img,
            }))
        }
      } catch (err) {
        console.error("Error al cargar el producto:", err)
        error.value = err.message
        toast.error("Error al cargar el producto")
      } finally {
        loading.value = false
      }
    }

    // Calcular el precio total basado en la cantidad
    const totalPrice = computed(() => {
      if (!productItems.value) return "0.00"
      return (productItems.value.price * quantity.value).toFixed(2)
    })

    // Obtener la imagen principal actual
    const currentImage = computed(() => {
      if (!productItems.value || !productItems.value.images) return ""
      return productItems.value.images[selectedImageIndex.value]
    })

    // Actualizar la cantidad
    const updateQuantity = (newQuantity) => {
      if (newQuantity < 1) return
      quantity.value = newQuantity
    }

    // Incrementar cantidad
    const increaseQuantity = () => {
      quantity.value++
    }

    // Decrementar cantidad
    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    // Cambiar la imagen seleccionada
    const selectImage = (index) => {
      selectedImageIndex.value = index
    }

    // Mostrar/ocultar zoom de imagen
    const toggleZoom = () => {
      showZoom.value = !showZoom.value
    }

    // Cerrar zoom al hacer clic fuera de la imagen
    const closeZoom = (event) => {
      if (event.target.classList.contains("zoom-overlay")) {
        showZoom.value = false
      }
    }

    // Agregar al carrito
    const addToCart = async () => {
      try {
        if (!productItems.value) {
          toast.error("No se ha podido agregar el producto al carrito: Producto no disponible")
          return
        }

        // Usar el servicio de carrito para agregar el producto
        const result = await cartService.addToCart(productItems.value, quantity.value)

        if (result.alreadyInCart) {
          // Si el producto ya está en el carrito, mostrar un mensaje diferente
          toast.info(`${productItems.value.name} ya está en tu carrito`, {
            title: "Producto en carrito",
          })
        } else if (result.success) {
          // Si se agregó correctamente, mostrar mensaje de éxito
          toast.success(`${productItems.value.name} ha sido agregado exitosamente`, {
            title: "Producto agregado",
          })
        } else {
          // Si hubo un error, mostrar mensaje de error
          throw new Error(result.message || "Error al agregar al carrito")
        }
      } catch (error) {
        // Mostrar toast de error
        toast.error(`No se ha podido agregar el producto al carrito`, {
          title: "Error",
        })
        console.error("Error al agregar al carrito:", error)
      }
    }

    // Observar cambios en la ruta para recargar el producto
    watch(
      () => route.query.id,
      (newId) => {
        if (newId) {
          console.log("Route query changed, reloading product...")
          loadProductDetails()
        }
      },
      { immediate: true },
    )

    // Inicializar
    onMounted(() => {
      loadProductDetails()
    })

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
    }
  },
}

