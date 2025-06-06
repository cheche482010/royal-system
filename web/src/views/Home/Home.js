"use client"

import { ref, onMounted } from "vue"
import { StarIcon, ArrowRightIcon, DogIcon, CatIcon, ShoppingCartIcon } from "lucide-vue-next"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.vue"
import { useProductsService } from "../../services/products.service"
import { useToast } from "../../services/toast.service"
import { apiService } from "../../services/api.service"

export default {
  name: "Home",
  components: {
    StarIcon,
    ArrowRightIcon,
    DogIcon,
    CatIcon,
    ShoppingCartIcon,
    Header,
    Footer,
    ProductCarousel,
  },
  setup() {
    const activeSlide = ref(0)
    const activeTab = ref("perros")
    const productsService = useProductsService()
    const toast = useToast()

    const banners = ref([
      {
        brand: "TRAVENESS",
        title: "Productos 100% naturales",
        features: [
          { icon: "div", text: "PREBIÓTICOS" },
          { icon: "div", text: "EXTRACTOS BOTÁNICOS" },
          { icon: "div", text: "SUPLEMENTOS" },
        ],
        discount: "-15% dto.",
        subtitle: "Recetas de Salmón y Pollo",
        cta: "ver oferta",
        link: "/offer/traveness",
        image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg",
      },

      // Más banners aquí
    ])

    const categoryTabs = ref([
      { id: "perros", name: "Perros", icon: DogIcon },
      { id: "gatos", name: "Gatos", icon: CatIcon },
    ])

    const featuredSection = ref({
      title: "Productos",
      link: "/Products",
    })

    const featuredProducts = ref([])

    const setActiveSlide = (index) => {
      activeSlide.value = index
    }

    const setActiveTab = (tabId) => {
      activeTab.value = tabId
    }

    // Cargar productos destacados
    const loadFeaturedProducts = async () => {
      try {
        const query = ""
        let categoriaId = null
        let marcaId = null

        const response = await apiService.searchProducts(query, categoriaId, marcaId)
        if (!response.success || !response.data) {
          throw new Error("Respuesta inválida del servidor")
        }

        featuredProducts.value = response.data
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
      } catch (error) {
        console.error("Error al cargar productos destacados:", error)
        toast.error("Error al cargar productos destacados", {
          title: "Error",
        })
      }
    }

    const notifyWhenAvailable = () => {
      toast.success("Te notificaremos cuando tengamos nuevos productos disponibles", {
        title: "Notificación registrada",
      })
    }

    onMounted(() => {
      loadFeaturedProducts()
    })

    return {
      activeSlide,
      activeTab,
      banners,
      categoryTabs,
      featuredSection,
      featuredProducts,
      setActiveSlide,
      setActiveTab,
      notifyWhenAvailable,
    }
  },
}
