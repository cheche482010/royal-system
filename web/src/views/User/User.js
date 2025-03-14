import { ref } from 'vue';
import Header from '../../components/Header/Header.vue';
import { 
  PackageIcon, 
  MapPinIcon, 
  PawPrintIcon, 
  UserIcon, 
  LogOutIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  LoaderIcon
} from 'lucide-vue-next';

export default {
  name: 'User',
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
    Header
  },
  setup() {
    const activeSection = ref('orders');
    const isUpdating = ref(false);
    const isUpdatingPassword = ref(false);
    
    const user = ref({
      name: 'Juan Pérez',
      email: 'juan.perez@example.com'
    });
    
    const navItems = ref([
      { id: 'orders', label: 'Mis Pedidos', icon: PackageIcon },
      { id: 'addresses', label: 'Mis Direcciones', icon: MapPinIcon },
      { id: 'pets', label: 'Mis Mascotas', icon: PawPrintIcon },
      { id: 'profile', label: 'Mi Perfil', icon: UserIcon }
    ]);
    
    const orders = ref([
      {
        id: 1,
        number: '10023456',
        date: '15/03/2023',
        status: 'delivered',
        statusText: 'Entregado',
        total: '45,90€',
        products: [
          {
            id: 1,
            name: 'Collar Antiparasitario para Perros Pequeño - 8 Kg',
            price: '36,49€',
            quantity: 1,
            image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80'
          }
        ]
      },
      {
        id: 2,
        number: '10023455',
        date: '02/03/2023',
        status: 'shipped',
        statusText: 'Enviado',
        total: '78,35€',
        products: [
          {
            id: 2,
            name: 'Pipetas Tri-Act Solución Spot-On para Perros de 20-40 Kg 3 Pipetas',
            price: '30,89€',
            quantity: 1,
            image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80'
          },
          {
            id: 3,
            name: 'Pienso para perros adultos Royal Canin Medium Adult',
            price: '47,46€',
            quantity: 1,
            image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=80&width=80'
          }
        ]
      }
    ]);
    
    const addresses = ref([
      {
        id: 1,
        title: 'Casa',
        name: 'Juan Pérez',
        street: 'Calle Mayor 123, 2º B',
        postalCode: '28001',
        city: 'Madrid',
        country: 'España',
        phone: '+34 600 123 456',
        default: true
      },
      {
        id: 2,
        title: 'Trabajo',
        name: 'Juan Pérez',
        street: 'Calle Velázquez 45, Oficina 3',
        postalCode: '28006',
        city: 'Madrid',
        country: 'España',
        phone: '+34 600 123 456',
        default: false
      }
    ]);
    
    const pets = ref([
      {
        id: 1,
        name: 'Max',
        breed: 'Labrador Retriever',
        age: 3,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
      },
      {
        id: 2,
        name: 'Luna',
        breed: 'Gato Siamés',
        age: 2,
        image: 'https://petsplanet.com.ve/wp-content/uploads/2024/12/8595602528134.jpg?height=100&width=100'
      }
    ]);
    
    const profileForm = ref({
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34 600 123 456',
      newsletter: true
    });
    
    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    });
    
    const setActiveSection = (section) => {
      activeSection.value = section;
    };
    
    const handleLogout = () => {
      // Lógica para cerrar sesión
      console.log('Cerrando sesión...');
    };
    
    const updateProfile = async () => {
      isUpdating.value = true;
      
      try {
        // Aquí iría la lógica para actualizar el perfil
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
        console.log('Perfil actualizado:', profileForm.value);
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
      } finally {
        isUpdating.value = false;
      }
    };
    
    const updatePassword = async () => {
      isUpdatingPassword.value = true;
      
      try {
        // Aquí iría la lógica para actualizar la contraseña
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
        console.log('Contraseña actualizada');
        
        // Resetear el formulario
        passwordForm.value = {
          current: '',
          new: '',
          confirm: ''
        };
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
      } finally {
        isUpdatingPassword.value = false;
      }
    };
    
    return {
      activeSection,
      user,
      navItems,
      orders,
      addresses,
      pets,
      profileForm,
      passwordForm,
      isUpdating,
      isUpdatingPassword,
      setActiveSection,
      handleLogout,
      updateProfile,
      updatePassword
    };
  }
};