"use client"

import { ref, computed, onMounted, watch } from "vue"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import PDF from "../../components/PDF/PDF.vue"
import { useAuth } from "../../composables/useAuth"
import { userService } from "../../services/user.service"
import { ordenService } from "../../services/orden.service"
import { useToast } from "../../services/toast.service"
import { useNotificacionService } from "../../services/notificacion.service"
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
  BellIcon,
  EyeIcon,
  CheckCircle2Icon,
  FileTextIcon,
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
    BellIcon,
    EyeIcon,
    CheckCircle2Icon,
    FileTextIcon,
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
    const isLoadingNotifications = ref(false)
    const error = ref(null)
    const ordersError = ref(null)
    const notificationsError = ref(null)
    const toast = useToast()
    const auth = useAuth()
    const userData = ref(null)
    const router = useRouter()
    const route = useRoute()
    const activeSection = ref(route.path.includes("orders") ? "orders" : (route.path.includes("notifications") ? "notifications" : "profile"))
    const showPDFPopup = ref(false)
    const selectedOrderId = ref(null)
    const selectedOrder = ref(null)
    const notifications = ref([])
    const notificacionService = useNotificacionService()
    const showComprobantePopup = ref(false)
    const comprobanteImgUrl = ref("")

    // Reemplazar el objeto user con un computed que use los datos completos
    const user = computed(() => ({
      name: userData.value?.nombre || auth.userName,
      email: userData.value?.correo || auth.user.value?.correo || "",
    }))

    // 1. Detectar si el usuario es admin
    const isAdmin = computed(() => userData.value?.role === "Admin")

    // 2. Cambiar el label de navItems y la carga de pedidos según el rol
    const navItems = computed(() => [
      { id: "profile", label: "Mi Perfil", icon: UserIcon },
      { id: "orders", label: isAdmin.value ? "Pedidos" : "Mis Pedidos", icon: PackageIcon },
      { id: "notifications", label: "Notificaciones", icon: BellIcon },
    ])

    // 3. Añadir pestaña de pedidos cancelados
    const activeOrdersTab = ref("active") // 'active', 'completed', 'cancelled'

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
        if (newPath.includes("orders")) {
          activeSection.value = "orders"
        } else if (newPath.includes("notifications")) {
          activeSection.value = "notifications"
          loadNotifications()
        } else {
          activeSection.value = "profile"
        }
      },
    )

    // 4. Cargar pedidos según el rol
    const loadOrders = async () => {

      isLoadingOrders.value = true
      ordersError.value = null
      try {
        const token = auth.sessionToken.value
        let response
        if (isAdmin.value) {
          response = await ordenService.getAllOrdenes(token)
        } else {
          response = await ordenService.getOrdenesByUsuario(auth.userId.value, token)
        }

        if (response.success && response.data) {
          // Transformar los datos de la API al formato que espera la UI
          orders.value = response.data.map((orden) => {
            // Determinar el estado y texto de estado
            let status = "processing"
            let statusText = "En Proceso"

            if (orden.status === "Completa") {
              status = "delivered"
              statusText = orden.status
            } else if (orden.status === "Cancelada") {
              status = "cancelled"
              statusText = orden.status
            } else if (orden.status === "Pendiente") {
              status = "shipped"
              statusText = orden.status
            }

            // Formatear la fecha
            const fecha = new Date(orden.created_at)
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(fecha.getMonth() + 1).toString().padStart(2, "0")}/${fecha.getFullYear()}`

            // Formatear los totales
            const montoTotal = orden.Pagos?.[0]?.monto_total || "0.00"
            const montoTotalBs = orden.Pagos?.[0]?.monto_total_bs || "0.00"

            return {
              id: orden.id,
              number: `${orden.id}`.padStart(6, "0"),
              date: fechaFormateada,
              status: status,
              statusText: statusText,
              total: `${parseFloat(montoTotal).toFixed(2)}$`,
              totalBs: formatBs(montoTotalBs),
              isCompleted: orden.status === "Completa",
              products:
                orden.DetalleOrdens?.map((detalle) => {
                  const price = Number.parseFloat(detalle.Producto?.precio_producto || "0")
                  const quantity = detalle.cantidad
                  const total = (price * quantity).toFixed(2)
                  const precioBs = detalle.precio_bs || "0.00"
                  return {
                    id: detalle.producto_id,
                    name: detalle.Producto?.nombre || "Producto",
                    price: `${price.toFixed(2)}$`,
                    quantity: quantity,
                    tipoPrecio: detalle.tipo_precio,
                    total: `${total}$`,
                    totalPagado: formatBs(precioBs),
                    image: `${config.API_BASE_URL}${detalle.Producto?.producto_img}` || "https://placehold.co/200x200",
                  }
                }) || [],
              Pagos: orden.Pagos,
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
          await loadOrders()
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

    // Función para formatear montos en Bs
    function formatBs(amount) {
      if (!amount) return "0,00 Bs"
      return (
        Number(amount)
          .toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
        " Bs"
      )
    }

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

    // Cargar notificaciones del usuario
    const loadNotifications = async () => {
      if (!auth.isAuthenticated.value) {
        return
      }

      isLoadingNotifications.value = true
      notificationsError.value = null

      try {
        const response = await notificacionService.getNotificaciones()
        if (response.success && response.data) {
          notifications.value = response.data
        } else {
          notificationsError.value = "No se pudieron cargar las notificaciones"
          toast.error("Error al cargar las notificaciones")
        }
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
        notificationsError.value = "Error al cargar las notificaciones"
      } finally {
        isLoadingNotifications.value = false
      }
    }

    // Marcar notificación como leída
    const markAsRead = async (id) => {
      try {
        const response = await notificacionService.marcarComoLeida(id)
        if (response.success) {
          const notification = notifications.value.find(n => n.id === id)
          if (notification) {
            notification.leida = true
          }
          toast.success("Notificación marcada como leída")
        }
      } catch (error) {
        console.error("Error al marcar notificación como leída:", error)
        toast.error("Error al marcar notificación como leída")
      }
    }

    // Cargar los datos del usuario cuando el componente se monta
    onMounted(() => {
      loadUserData()
      loadNotifications() 
    })

    const setActiveSection = (section) => {
      if (section === "orders") {
        router.push("/user/orders")
      } else if (section === "notifications") {
        router.push("/user/notifications")
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

    // 5. Filtrar pedidos cancelados
    const cancelledOrders = computed(() => {
      return orders.value.filter((order) => order.status === "cancelled" || order.statusText === "Cancelada")
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

    // Actualizar el método de logout para usar el auth y redirigir a home
    const handleLogout = () => {
      auth.clearUser()
      console.log("Cerrando sesión...")
      router.push('/')
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

    function openComprobantePopup(order) {
      // Toma el primer pago, puedes ajustar si hay varios pagos
      const pago = order.Pagos?.[0]
      if (pago && pago.comprobante_img) {
        comprobanteImgUrl.value = config.API_BASE_URL + "/" + pago.comprobante_img.replace(/\\/g, "/")
        showComprobantePopup.value = true
      }
    }

    // 6. Agregar lógica para cambiar estado de orden (solo admin)
    const showChangeStatusModal = ref(false)
    const orderToChangeStatus = ref(null)
    const newStatus = ref("Completa")
    const motivoCancelacion = ref("")
    const adminPassword = ref("")
    const isChangingStatus = ref(false)

    const openChangeStatusModal = (order) => {
      orderToChangeStatus.value = order
      newStatus.value = "Completa"
      motivoCancelacion.value = ""
      adminPassword.value = ""
      showChangeStatusModal.value = true
    }

    const changeOrderStatus = async () => {
      if (!adminPassword.value) {
        toast.error("Debes ingresar tu contraseña")
        return
      }
      if (newStatus.value === "Cancelada" && !motivoCancelacion.value) {
        toast.error("Debes ingresar el motivo de cancelación")
        return
      }
      isChangingStatus.value = true
      try {
        const token = auth.sessionToken.value
        const response = await ordenService.updateOrdenStatus(orderToChangeStatus.value.id, {
          status: newStatus.value,
          admin_password: adminPassword.value,
          motivo_cancelacion: motivoCancelacion.value,
        }, token)

        if (response && response.success) {
          toast.success("Estado de la orden actualizado")
          showChangeStatusModal.value = false
          await loadOrders()
        } else {
          toast.error(response?.message)
        }
      } catch (e) {
        toast.error("No se pudo cambiar el estado")
      } finally {
        isChangingStatus.value = false
      }
    }

    // Función para extraer el motivo de cancelación de la notificación
    function getCancelReason(orderId) {
      const noti = notifications.value.find(
        n => n.orden_id === orderId && n.tipo === "ORDEN_CANCELADA"
      )
      console.log(orderId, notifications.value)

      if (noti && noti.mensaje) {
        // Captura todo después de "Motivo:" hasta el final o salto de línea
        const match = noti.mensaje.match(/Motivo:\s*([^\.\n]+)/i)
        if (match && match[1]) {
          return match[1].trim()
        }
        // Si no hay "Motivo:", intenta devolver todo el mensaje
        return noti.mensaje
      }
      return null
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
      cancelledOrders,
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
      loadOrders,
      showPDFPopup,
      selectedOrderId,
      selectedOrder,
      openPDFPopup,
      notifications,
      isLoadingNotifications,
      notificationsError,
      loadNotifications,
      markAsRead,
      formatDate,
      showComprobantePopup,
      comprobanteImgUrl,
      openComprobantePopup,
      isAdmin,
      showChangeStatusModal,
      orderToChangeStatus,
      newStatus,
      motivoCancelacion,
      adminPassword,
      isChangingStatus,
      openChangeStatusModal,
      changeOrderStatus,
      getCancelReason,
    }
  },
}
