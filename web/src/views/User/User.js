"use client"

import { ref, computed, onMounted } from "vue"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import { useAuth } from "../../composables/useAuth"
import { userService } from "../../services/user.service"
import { useToast } from "../../services/toast.service"

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
  setup() {
    const activeSection = ref("orders")
    const isUpdating = ref(false)
    const isUpdatingPassword = ref(false)
    const isLoading = ref(true)
    const error = ref(null)
    const toast = useToast()
    const auth = useAuth()
    const userData = ref(null)

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

    // Modificar la estructura de orders para incluir un campo que indique si están finalizados o no
    const orders = ref([
      {
        id: 1,
        number: "10023456",
        date: "15/03/2023",
        status: "delivered",
        statusText: "Entregado",
        total: "45,90€",
        isCompleted: true,
        products: [
          {
            id: 1,
            name: "Collar Antiparasitario para Perros Pequeño - 8 Kg",
            price: "36,49€",
            quantity: 1,
            image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80",
          },
        ],
      },
      {
        id: 2,
        number: "10023455",
        date: "02/03/2023",
        status: "shipped",
        statusText: "Enviado",
        total: "78,35€",
        isCompleted: false,
        products: [
          {
            id: 2,
            name: "Pipetas Tri-Act Solución Spot-On para Perros de 20-40 Kg 3 Pipetas",
            price: "30,89€",
            quantity: 1,
            image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80",
          },
          {
            id: 3,
            name: "Pienso para perros adultos Royal Canin Medium Adult",
            price: "47,46€",
            quantity: 1,
            image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80",
          },
        ],
      },
      {
        id: 3,
        number: "10023450",
        date: "28/02/2023",
        status: "delivered",
        statusText: "Entregado",
        total: "22,95€",
        isCompleted: true,
        products: [
          {
            id: 4,
            name: "Arena para Gatos Premium 10kg",
            price: "22,95€",
            quantity: 1,
            image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80",
          },
        ],
      },
      {
        id: 4,
        number: "10023458",
        date: "20/03/2023",
        status: "processing",
        statusText: "En Proceso",
        total: "31,98€",
        isCompleted: false,
        products: [
          {
            id: 5,
            name: "Juguete Interactivo para Gatos",
            price: "15,99€",
            quantity: 2,
            image: "https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80",
          },
        ],
      },
    ])

    // Actualizar el profileForm como un ref para que se pueda modificar
    const profileForm = ref(null)

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
      activeSection.value = section
    }

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
          console.error("Error al actualizar la contraseña:", response.message)
          toast.error("Error al actualizar la contraseña", {
            title: "Error",
          })  
        }
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error)
      } finally {
        isUpdatingPassword.value = false
      }
    }

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
      error,
      setActiveSection,
      setActiveOrdersTab,
      handleLogout,
      updateProfile,
      updatePassword,
      loadUserData,
    }
  },
}
