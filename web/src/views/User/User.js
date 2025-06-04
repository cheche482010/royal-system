"use client"

import { ref, computed, onMounted, watch } from "vue"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
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
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL
    }
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
    const activeSection = ref(route.path.includes('orders') ? 'orders' : 'profile');

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

    // Observar cambios en la ruta
    watch(() => route.path, (newPath) => {
      activeSection.value = newPath.includes('orders') ? 'orders' : 'profile';
    });

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
          orders.value = response.data.map(orden => {
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
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`

            // Formatear el total
            const totalFormateado = `${parseFloat(orden.monto_total).toFixed(2)}$`

            return {
              id: orden.id,
              number: `${orden.id}`.padStart(8, '0'),
              date: fechaFormateada,
              status: status,
              statusText: statusText,
              total: totalFormateado,
              isCompleted: orden.status === "Completa",
              products: orden.DetalleOrdens?.map(detalle => ({
                id: detalle.producto_id,
                name: detalle.Producto?.nombre || "Producto",
                price: `${parseFloat(detalle.precio).toFixed(2)}$`,
                quantity: detalle.cantidad,
                image: `${config.API_BASE_URL}${detalle.Producto?.producto_img}` || "https://placehold.co/200x200",
              })) || []
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
      name: '',
      email: '',
      phone: '',
      newsletter: false
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
      if (section === 'orders') {
        router.push('/user/orders');
      } else {
        router.push('/user/profile');
      }
    };

    // Añadir método para cambiar entre pestañas de pedidos
    const setActiveOrdersTab = (tab) => {
      activeOrdersTab.value = tab
    }

    // Añadir computed properties para filtrar los pedidos
    const activeOrders = computed(() => {
      return orders.value.filter((order) => !order.isCompleted)
    })

    const completedOrders = computed(() => {
      return orders.value.filter((order) => order.isCompleted)
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
        });
        return;
      }

      isUpdatingPassword.value = true;

      try {
        if (passwordForm.value.new !== passwordForm.value.confirm) {
          toast.error("Las contraseñas no coinciden", {
            title: "Error",
          });
          return;
        }

        const passwordData = {
          current_password: passwordForm.value.current,
          new_password: passwordForm.value.new,
        };

        const token = auth.sessionToken.value;
        const response = await userService.updatePassword(passwordData, token);

        if (response.success) {
          toast.success("Contraseña actualizada correctamente", {
            title: "Éxito",
          });
          passwordForm.value = {
            current: "",
            new: "",
            confirm: "",
          };
        } else {
          toast.error(response.message, {
            title: "Error",
          });
        }
      } catch (error) {
        toast.error("Ocurrió un error al actualizar la contraseña", {
          title: "Error",
        });
      } finally {
        isUpdatingPassword.value = false;
      }
    };

    // Añadir las nuevas propiedades y métodos al return
    return {
      activeSection,
      activeOrdersTab,
      user,
      userData,
      navItems,
      orders,
      activeOrders,
      completedOrders,
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
      handleLogout,
      updateProfile,
      updatePassword,
      loadUserData,
      loadUserOrders,
    }
  },
}