import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-vue-next'; 

export default {
  name: 'Login',
  components: {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon
  },
  setup() {
    const router = useRouter();
    const documento = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const logo = ref({
      image: new URL('../../assets/img/logo.jpg', import.meta.url).href,
      name: 'Pet Shop'
    });
    
    const handleLogin = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';
        
        // Validar campos
        if (!documento.value) {
          errorMessage.value = 'Debe ingresar su documento (RIF o Cédula)';
          return;
        }
        
        if (!password.value) {
          errorMessage.value = 'Debe ingresar su contraseña';
          return;
        }
        
        // Crear objeto con datos de inicio de sesión
        const loginData = {
          documento: documento.value,
          user_password: password.value
        };
        
        // Enviar solicitud al servidor
        const response = await fetch(`http://localhost:3000/api/usuarios/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión');
        }
        
        // Si remember está activado, guardar el documento en localStorage
        if (rememberMe.value) {
          localStorage.setItem('remembered_documento', documento.value);
        } else {
          localStorage.removeItem('remembered_documento');
        }
        
        // Guardar token en localStorage
        if (data.data.session) {
          localStorage.setItem('session_token', data.data.session.session_token);
          localStorage.setItem('session_active', data.data.session.is_active);
        }
        
        // Redirección después del login exitoso
        router.push('/');
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        errorMessage.value = error.message || 'Error al iniciar sesión';
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
      logo,
      togglePassword,
      handleLogin
    };
  }
};