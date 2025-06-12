"use client"

import { ref, computed, onMounted, watch } from "vue"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import PDF from "../../components/PDF/PDF.vue"
import { useAuth } from "../../composables/useAuth"
import { userService } from "../../services/user.service"
import { ordenService } from "../../services/orden.service"
import { useToast } from "../../services/toast.service"
import { config } from "../../config/config"
import { useRouter, useRoute } from "vue-router"

import {
  PackageIcon,
  MapPinIcon,
  PawPrintIcon,
  UserIcon,
  LogOutIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  LoaderIcon,
} from "lucide-vue-next"

export default {
  name: "User",
  components: {
    PackageIcon,
    MapPinIcon,
    PawPrintIcon,
    UserIcon,
    LogOutIcon,
    EditIcon,
    TrashIcon,
    PlusIcon,
    LoaderIcon,
    Header,
    Footer,
    PDF,
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL,
    },
  },
  setup() {
    const isUpdating = ref(false)
    const isUpdatingPassword = ref(false)
    const isLoading = ref(true)
    const isLoadingOrders = ref(false)
    const error = ref(null)
    const ordersError = ref(null)
    const toast = useToast()
    const auth = useAuth()
    const userData = ref(null)
    const router = useRouter()
    const route = useRoute()
    const activeSection = ref(route.path.includes("orders") ? "orders" : "profile")
    const showPDFPopup = ref(false)
    const selectedOrderId = ref(null)
    const selectedOrder = ref(null)

    // Reemplazar el objeto user con un computed que use los datos completos
    const user = computed(() => ({
      name: userData.value?.nombre || auth.userName,
      email: userData.value?.correo || auth.user.value?.correo || "",
    }))

    const navItems = ref([
      { id: "orders", label: "Mis Pedidos", icon: PackageIcon },
      { id: "profile", label: "Mi Perfil", icon: UserIcon },
    ])

    // Añadir una nueva propiedad para controlar la pestaña activa de pedidos
    const activeOrdersTab = ref("active")

    // Usar ref para las órdenes que vendrán de la BD
    const orders = ref([])

    // Agregar estas nuevas propiedades ref después de las existentes (alrededor de la línea donde están los otros ref)
    const searchQuery = ref("")
    const currentPage = ref(1)
    const itemsPerPage = ref(5)
    const sortBy = ref("date") // 'date', 'total', 'status'
    const sortOrder = ref("desc") // 'asc', 'desc'

    // Observar cambios en la ruta
    watch(
      () => route.path,
      (newPath) => {
        activeSection.value = newPath.includes("orders") ? "orders" : "profile"
      },
    )

    // Función para cargar las órdenes del usuario
    const loadUserOrders = async () => {
      if (!auth.isAuthenticated.value || !auth.userId.value) {
        return
      }

      isLoadingOrders.value = true
      ordersError.value = null

      try {
        const token = auth.sessionToken.value
        const response = await ordenService.getOrdenesByUsuario(auth.userId.value, token)

        if (response.success && response.data) {
          // Transformar los datos de la API al formato que espera la UI
          orders.value = response.data.map((orden) => {
            // Determinar el estado y texto de estado
            let status = "processing"
            let statusText = "En Proceso"

            if (orden.status === "Completa") {
              status = "delivered"
              statusText = "Entregado"
            } else if (orden.status === "Cancelada") {
              status = "cancelled"
              statusText = "Cancelado"
            } else if (orden.status === "Pendiente") {
              status = "shipped"
              statusText = "Enviado"
            }

            // Formatear la fecha
            const fecha = new Date(orden.created_at)
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(fecha.getMonth() + 1).toString().padStart(2, "0")}/${fecha.getFullYear()}`

            // Formatear el total
            const totalFormateado = `${Number.parseFloat(orden.monto_total).toFixed(2)}$`

            return {
              id: orden.id,
              number: `${orden.id}`.padStart(8, "0"),
              date: fechaFormateada,
              status: status,
              statusText: statusText,
              total: totalFormateado,
              isCompleted: orden.status === "Completa",
              products:
                orden.DetalleOrdens?.map((detalle) => {
                  const price = Number.parseFloat(detalle.precio);
                  const quantity = detalle.cantidad;
                  const total = (price * quantity).toFixed(2);
                  return {
                    id: detalle.producto_id,
                    name: detalle.Producto?.nombre || "Producto",
                    price: `${price.toFixed(2)}$`,
                    quantity: detalle.cantidad,
                    total: `${total}$`,
                    image: `${config.API_BASE_URL}${detalle.Producto?.producto_img}` || "https://placehold.co/200x200",
                  }
                }) || [],
            }
          })
        } else {
          ordersError.value = "No se pudieron cargar las órdenes"
          toast.error("Error al cargar las órdenes", {
            title: "Error",
          })
        }
      } catch (err) {
        console.error("Error al cargar órdenes:", err)
        ordersError.value = "Error al cargar las órdenes"
        toast.error("Error al cargar las órdenes", {
          title: "Error",
        })
      } finally {
        isLoadingOrders.value = false
      }
    }

    // Actualizar el profileForm como un ref para que se pueda modificar
    const profileForm = ref({
      name: "",
      email: "",
      phone: "",
      newsletter: false,
    })

    const passwordForm = ref({
      current: "",
      new: "",
      confirm: "",
    })

    // Función para cargar los datos completos del usuario
    const loadUserData = async () => {
      if (!auth.isAuthenticated.value) {
        isLoading.value = false
        return
      }

      isLoading.value = true
      error.value = null

      try {
        // Obtener el token de sesión para la autenticación
        const token = auth.sessionToken.value

        // Si tenemos el ID del usuario, usamos getUserById
        const response = await userService.getUserById(auth.userId.value, token)

        if (response.success && response.data) {
          userData.value = response.data

          profileForm.value = {
            name: userData.value.nombre,
            email: userData.value.correo || "",
            phone: userData.value.telefono || "",
          }

          // Cargar las órdenes del usuario después de cargar sus datos
          await loadUserOrders()
        } else {
          error.value = "No se pudieron cargar los datos del usuario"
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err)
        error.value = "Error al cargar los datos del usuario"
      } finally {
        isLoading.value = false
      }
    }

    // Cargar los datos del usuario cuando el componente se monta
    onMounted(() => {
      loadUserData()
    })

    const setActiveSection = (section) => {
      if (section === "orders") {
        router.push("/user/orders")
      } else {
        router.push("/user/profile")
      }
    }

    // Añadir método para cambiar entre pestañas de pedidos
    const setActiveOrdersTab = (tab) => {
      activeOrdersTab.value = tab
      currentPage.value = 1
    }

    // Añadir computed properties para filtrar los pedidos
    const activeOrders = computed(() => {
      return orders.value.filter((order) => !order.isCompleted)
    })

    const completedOrders = computed(() => {
      return orders.value.filter((order) => order.isCompleted)
    })

    // Agregar estos computed properties after completedOrders
    const filteredActiveOrders = computed(() => {
      let filtered = [...activeOrders.value] // Crear una copia para evitar mutaciones

      // Filtrar por búsqueda - incluir fecha y total
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter((order) => {
          // Buscar en número de pedido
          const matchesNumber = order.number.toLowerCase().includes(query)

          // Buscar en nombres de productos
          const matchesProduct = order.products.some((product) => product.name.toLowerCase().includes(query))

          // Buscar en estado
          const matchesStatus = order.statusText.toLowerCase().includes(query)

          // Buscar en fecha (formato dd/mm/yyyy)
          const matchesDate = order.date.includes(query)

          // Buscar en total (sin el símbolo $)
          const totalValue = order.total.replace("$", "")
          const matchesTotal = totalValue.includes(query)

          return matchesNumber || matchesProduct || matchesStatus || matchesDate || matchesTotal
        })
      }

      // Ordenar
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortBy.value) {
          case "date":
            // Convertir fecha dd/mm/yyyy a objeto Date para comparación correcta
            const [dayA, monthA, yearA] = a.date.split("/")
            const [dayB, monthB, yearB] = b.date.split("/")
            aValue = new Date(yearA, monthA - 1, dayA)
            bValue = new Date(yearB, monthB - 1, dayB)
            break
          case "total":
            // Remover el símbolo $ y convertir a número
            aValue = Number.parseFloat(a.total.replace("$", ""))
            bValue = Number.parseFloat(b.total.replace("$", ""))
            break
          case "status":
            aValue = a.statusText.toLowerCase()
            bValue = b.statusText.toLowerCase()
            break
          default:
            return 0
        }

        // Aplicar orden ascendente o descendente
        if (sortOrder.value === "asc") {
          if (aValue < bValue) return -1
          if (aValue > bValue) return 1
          return 0
        } else {
          if (aValue > bValue) return -1
          if (aValue < bValue) return 1
          return 0
        }
      })

      return filtered
    })

    const filteredCompletedOrders = computed(() => {
      let filtered = [...completedOrders.value] // Crear una copia para evitar mutaciones

      // Filtrar por búsqueda - incluir fecha y total
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter((order) => {
          // Buscar en número de pedido
          const matchesNumber = order.number.toLowerCase().includes(query)

          // Buscar en nombres de productos
          const matchesProduct = order.products.some((product) => product.name.toLowerCase().includes(query))

          // Buscar en estado
          const matchesStatus = order.statusText.toLowerCase().includes(query)

          // Buscar en fecha (formato dd/mm/yyyy)
          const matchesDate = order.date.includes(query)

          // Buscar en total (sin el símbolo $)
          const totalValue = order.total.replace("$", "")
          const matchesTotal = totalValue.includes(query)

          return matchesNumber || matchesProduct || matchesStatus || matchesDate || matchesTotal
        })
      }

      // Ordenar
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortBy.value) {
          case "date":
            // Convertir fecha dd/mm/yyyy a objeto Date para comparación correcta
            const [dayA, monthA, yearA] = a.date.split("/")
            const [dayB, monthB, yearB] = b.date.split("/")
            aValue = new Date(yearA, monthA - 1, dayA)
            bValue = new Date(yearB, monthB - 1, dayB)
            break
          case "total":
            // Remover el símbolo $ y convertir a número
            aValue = Number.parseFloat(a.total.replace("$", ""))
            bValue = Number.parseFloat(b.total.replace("$", ""))
            break
          case "status":
            aValue = a.statusText.toLowerCase()
            bValue = b.statusText.toLowerCase()
            break
          default:
            return 0
        }

        // Aplicar orden ascendente o descendente
        if (sortOrder.value === "asc") {
          if (aValue < bValue) return -1
          if (aValue > bValue) return 1
          return 0
        } else {
          if (aValue > bValue) return -1
          if (aValue < bValue) return 1
          return 0
        }
      })

      return filtered
    })

    // Computed para paginación de pedidos activos
    const paginatedActiveOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredActiveOrders.value.slice(start, end)
    })

    // Computed para paginación de pedidos completados
    const paginatedCompletedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredCompletedOrders.value.slice(start, end)
    })

    // Computed para el total de páginas
    const totalPages = computed(() => {
      const currentOrders =
        activeOrdersTab.value === "active" ? filteredActiveOrders.value : filteredCompletedOrders.value
      return Math.ceil(currentOrders.length / itemsPerPage.value)
    })

    // Computed para generar los números de página a mostrar
    const paginationNumbers = computed(() => {
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2 // Número de páginas a mostrar a cada lado de la página actual

      if (total <= 7) {
        // Si hay 7 páginas o menos, mostrar todas
        return Array.from({ length: total }, (_, i) => i + 1)
      }

      const range = []
      const rangeWithDots = []

      // Siempre incluir la primera página
      range.push(1)

      // Calcular el rango alrededor de la página actual
      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i)
      }

      // Siempre incluir la última página
      if (total > 1) {
        range.push(total)
      }

      // Agregar puntos suspensivos donde sea necesario
      let prev = 0
      for (const page of range) {
        if (page - prev === 2) {
          rangeWithDots.push(prev + 1)
        } else if (page - prev !== 1) {
          rangeWithDots.push("...")
        }
        rangeWithDots.push(page)
        prev = page
      }

      return rangeWithDots
    })

    // Métodos para paginación
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    // Método para limpiar filtros
    const clearFilters = () => {
      searchQuery.value = ""
      currentPage.value = 1
      sortBy.value = "date"
      sortOrder.value = "desc"
    }

    // Watcher para resetear página cuando cambia la búsqueda o tab
    watch([searchQuery, activeOrdersTab], () => {
      currentPage.value = 1
    })

    // Watcher para resetear página cuando cambian los filtros de ordenamiento
    watch([sortBy, sortOrder], () => {
      currentPage.value = 1
    })

    // Actualizar el método de logout para usar el auth
    const handleLogout = () => {
      auth.clearUser()
      console.log("Cerrando sesión...")
    }

    const updateProfile = async () => {
      isUpdating.value = true

      try {
        // Construir el objeto de datos del usuario para la actualización
        const userUpdateData = {
          nombre: profileForm.value.name,
          telefono: profileForm.value.phone,
        }

        const token = auth.sessionToken.value
        const response = await userService.updateUserProfile(userUpdateData, token)

        if (response.success) {
          // Actualizar los datos locales
          userData.value = {
            ...userData.value,
            ...userUpdateData,
          }
          toast.success("Perfil actualizado correctamente", {
            title: "Éxito",
          })
        } else {
          toast.error("Error al actualizar el perfil", {
            title: "Error",
          })
        }
      } catch (error) {
        console.error("Error al actualizar el perfil:", error)
      } finally {
        isUpdating.value = false
      }
    }

    const updatePassword = async () => {
      // Validar campos vacíos primero
      if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
        toast.error("Por favor complete todos los campos", {
          title: "Error",
        })
        return
      }

      isUpdatingPassword.value = true

      try {
        if (passwordForm.value.new !== passwordForm.value.confirm) {
          toast.error("Las contraseñas no coinciden", {
            title: "Error",
          })
          return
        }

        const passwordData = {
          current_password: passwordForm.value.current,
          new_password: passwordForm.value.new,
        }

        const token = auth.sessionToken.value
        const response = await userService.updatePassword(passwordData, token)

        if (response.success) {
          toast.success("Contraseña actualizada correctamente", {
            title: "Éxito",
          })
          passwordForm.value = {
            current: "",
            new: "",
            confirm: "",
          }
        } else {
          toast.error(response.message, {
            title: "Error",
          })
        }
      } catch (error) {
        toast.error("Ocurrió un error al actualizar la contraseña", {
          title: "Error",
        })
      } finally {
        isUpdatingPassword.value = false
      }
    }

    const openPDFPopup = (orderId) => {
      selectedOrderId.value = orderId
      // Find the selected order from both active and completed orders
      const order = [...activeOrders.value, ...completedOrders.value].find(order => order.id === orderId)
      selectedOrder.value = order
      showPDFPopup.value = true
    }

    // Agregar las nuevas propiedades y métodos al return
    return {
      activeSection,
      activeOrdersTab,
      user,
      userData,
      navItems,
      orders,
      activeOrders,
      completedOrders,
      filteredActiveOrders,
      filteredCompletedOrders,
      paginatedActiveOrders,
      paginatedCompletedOrders,
      searchQuery,
      currentPage,
      itemsPerPage,
      sortBy,
      sortOrder,
      totalPages,
      paginationNumbers,
      profileForm,
      passwordForm,
      isUpdating,
      isUpdatingPassword,
      isLoading,
      isLoadingOrders,
      error,
      ordersError,
      setActiveSection,
      setActiveOrdersTab,
      goToPage,
      nextPage,
      prevPage,
      clearFilters,
      handleLogout,
      updateProfile,
      updatePassword,
      loadUserData,
      loadUserOrders,
      showPDFPopup,
      selectedOrderId,
      selectedOrder,
      openPDFPopup,
    }
  },
}
