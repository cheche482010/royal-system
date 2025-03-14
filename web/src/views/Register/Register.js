import { ref, computed } from 'vue';
import { EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-vue-next';

export default {
  name: 'Register',
  components: {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon
  },
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const acceptTerms = ref(false);
    const subscribeNewsletter = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);
    
    const passwordStrength = computed(() => {
      if (!password.value) return 0;
      
      let strength = 0;
      
      // Longitud mínima
      if (password.value.length >= 8) strength++;
      
      // Contiene números
      if (/\d/.test(password.value)) strength++;
      
      // Contiene letras minúsculas y mayúsculas
      if (/[a-z]/.test(password.value) && /[A-Z]/.test(password.value)) strength++;
      
      // Contiene caracteres especiales
      if (/[^a-zA-Z0-9]/.test(password.value)) strength++;
      
      return strength;
    });
    
    const strengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength === 0) return 'weak';
      if (strength === 1) return 'weak';
      if (strength === 2) return 'medium';
      if (strength === 3) return 'good';
      return 'strong';
    });
    
    const strengthText = computed(() => {
      const strength = passwordStrength.value;
      if (strength === 0) return 'Muy débil';
      if (strength === 1) return 'Débil';
      if (strength === 2) return 'Media';
      if (strength === 3) return 'Buena';
      return 'Fuerte';
    });
    
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    
    const handleRegister = async () => {
      isLoading.value = true;
      
      try {
        // Aquí iría la lógica de registro
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
        
        // Redirección después del registro exitoso
        // router.push('/');
      } catch (error) {
        console.error('Error de registro:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      firstName,
      lastName,
      email,
      password,
      acceptTerms,
      subscribeNewsletter,
      showPassword,
      isLoading,
      passwordStrength,
      strengthClass,
      strengthText,
      togglePassword,
      handleRegister
    };
  }
};