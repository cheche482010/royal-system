import { ref, computed, onMounted } from 'vue';
import { SearchIcon, BellIcon, UserIcon, LogInIcon, LogOutIcon, ShoppingCartIcon, TagIcon, PackageIcon, ChevronDown  } from 'lucide-vue-next';
import { useAuth } from '../../composables/useAuth';
import { useRouter } from 'vue-router';

export default {
  name: 'Header',
  components: {
    SearchIcon,
    BellIcon,
    UserIcon,
    LogInIcon,
    LogOutIcon,
    ShoppingCartIcon,
    TagIcon,
    PackageIcon,
    ChevronDown
  },
  props: {
    disableNav: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter();
    const auth = useAuth();
    const cartCount = ref(0);
    
    // Estado para los menús desplegables
    const showUserMenu = ref(false);
    const showNotifications = ref(false);

    // Notificaciones de ejemplo
    const notifications = ref([
      {
        id: 1,
        title: 'Pedido confirmado',
        message: 'Tu pedido #12345 ha sido confirmado y está en proceso.',
        date: '2023-10-15T14:30:00',
        read: false
      },
      {
        id: 2,
        title: 'Oferta especial',
        message: '¡50% de descuento en productos seleccionados!',
        date: '2023-10-14T09:15:00',
        read: true
      },
      {
        id: 3,
        title: 'Envío en camino',
        message: 'Tu pedido #12340 ha sido enviado y llegará pronto.',
        date: '2023-10-13T16:45:00',
        read: false
      }
    ]);
    
    // Calcular notificaciones no leídas
    const unreadNotifications = computed(() => {
      return notifications.value.filter(notification => !notification.read).length;
    });
    
    // Formatear fecha para mostrar en notificaciones
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Hoy';
      } else if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
      } else {
        return date.toLocaleDateString();
      }
    };
    
    // Marcar notificación como leída
    const markAsRead = (id) => {
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    };
    
    // Marcar todas como leídas
    const markAllAsRead = () => {
      notifications.value.forEach(notification => {
        notification.read = true;
      });
    };
    
    // Método para cerrar sesión
    const logout = () => {
      auth.clearUser();
      router.push('/');
      showUserMenu.value = false;
    };
    
    // Método para navegar a una ruta y cerrar el menú
    const navigateTo = (route) => {
      router.push(route);
      showUserMenu.value = false;
      showNotifications.value = false;
    };
    
    // Cerrar menús al hacer clic fuera de ellos
    const closeMenus = (event) => {
      const userMenuEl = document.querySelector('.user-menu');
      const userInfoEl = document.querySelector('.user-info');
      const notificationMenuEl = document.querySelector('.notification-menu');
      const notificationIconEl = document.querySelector('.notification-icon');
      
      if (userMenuEl && userInfoEl && !userMenuEl.contains(event.target) && !userInfoEl.contains(event.target)) {
        showUserMenu.value = false;
      }
      
      if (notificationMenuEl && notificationIconEl && !notificationMenuEl.contains(event.target) && !notificationIconEl.contains(event.target)) {
        showNotifications.value = false;
      }
    };
    
    // Agregar event listener para cerrar menús al hacer clic fuera
    onMounted(() => {
      document.addEventListener('click', closeMenus);
    });
    
    const categories = ref([
      { id: 1, name: 'Item I' },
      { id: 2, name: 'Item II' },
      { id: 3, name: 'Item III' },
      { id: 4, name: 'Item IV' },
    ]);

    const logo = ref({
      image: new URL('../../assets/img/logo.jpg', import.meta.url).href,
      name: 'Pet Shop'
    });

    return {
      cartCount,
      categories,
      logo,
      isAuthenticated: auth.isAuthenticated,
      userName: auth.userName,
      logout,
      navigateTo,
      showUserMenu,
      showNotifications,
      notifications,
      unreadNotifications,
      formatDate,
      markAsRead,
      markAllAsRead
    };
  }
};