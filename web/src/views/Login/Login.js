import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../composables/useAuth';
import { config } from '../../config/config';

import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon
} from 'lucide-vue-next';

export default {
  name: 'Login',
  components: {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon
  },
  props: {
    ASSETS: {
      type: Object,
      default: () => config.ASSETS.LOGO
    }
  },
  setup() {
    const router = useRouter();
    const auth = useAuth();
    const documento = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';

        if (!documento.value) {
          errorMessage.value = 'Debe ingresar su documento (RIF o Cédula)';
          isLoading.value = false;
          return;
        }

        if (!password.value) {
          errorMessage.value = 'Debe ingresar su contraseña';
          isLoading.value = false;
          return;
        }

        const response = await authService.login(documento.value, password.value);

        auth.setUser(response.data);

        if (rememberMe.value) {
          localStorage.setItem('remembered_documento', documento.value);
        } else {
          localStorage.removeItem('remembered_documento');
        }

        router.push('/');
      } catch (error) {
        errorMessage.value = error.message;
      } finally {
        isLoading.value = false;
      }
    };

    // Verificar si hay un documento recordado al cargar el componente
    const checkRememberedUser = () => {
      const rememberedDocumento = localStorage.getItem('remembered_documento');
      if (rememberedDocumento) {
        documento.value = rememberedDocumento;
        rememberMe.value = true;
      }
    };

    // Ejecutar al montar el componente
    checkRememberedUser();

    return {
      documento,
      password,
      rememberMe,
      showPassword,
      isLoading,
      errorMessage,
      togglePassword,
      handleLogin
    };
  }
};