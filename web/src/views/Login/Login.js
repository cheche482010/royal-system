import { ref } from 'vue';
import { EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-vue-next';

export default {
  name: 'Login',
  components: {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);
    
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
<<<<<<< Updated upstream
=======

    const logo = ref({
      image: new URL('../../assets/img/logo2.png', import.meta.url).href,
      name: 'Pet Shop'
    });
>>>>>>> Stashed changes
    
    const handleLogin = async () => {
      isLoading.value = true;
      
      try {
        // Aquí iría la lógica de autenticación
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
        
        // Redirección después del login exitoso
        // router.push('/');
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      email,
      password,
      rememberMe,
      showPassword,
      isLoading,
<<<<<<< Updated upstream
=======
      logo,
>>>>>>> Stashed changes
      togglePassword,
      handleLogin
    };
  }
};