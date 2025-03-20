import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  EyeIcon, 
  EyeOffIcon, 
  LoaderIcon, 
  UploadIcon, 
  FileIcon, 
  XIcon 
} from 'lucide-vue-next';

export default {
  name: 'Register',
  components: {
    EyeIcon,
    EyeOffIcon,
    LoaderIcon,
    UploadIcon,
    FileIcon,
    XIcon
  },
  setup() {
    const router = useRouter();
    
    // Datos del formulario
    const formData = ref({
      rif_cedula: '',
      documento_rif: null,
      nombre: '',
      direccion: '',
      registro_mercantil: null,
      correo: '',
      telefono: '',
      is_active: 1,
      is_delete: 0
    });
    
    // Estado de la contraseña
    const password = ref('');
    const showPassword = ref(false);
    
    // Estado de los archivos
    const rifFileSelected = ref(false);
    const rifFileName = ref('');
    const rifFilePreview = ref('');
    
    const registroFileSelected = ref(false);
    const registroFileName = ref('');
    const registroFilePreview = ref('');
    
    // Estado del formulario
    const acceptTerms = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    
    // Cálculo de la fortaleza de la contraseña
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
    
    // Funciones para manejar la contraseña
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    
    // Funciones para manejar archivos
    const handleFileUpload = (fileType, event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      if (fileType === 'documento_rif') {
        formData.value.documento_rif = file;
        rifFileName.value = file.name;
        rifFileSelected.value = true;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
          rifFilePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'registro_mercantil') {
        formData.value.registro_mercantil = file;
        registroFileName.value = file.name;
        registroFileSelected.value = true;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
          registroFilePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    
    const removeFile = (fileType) => {
      if (fileType === 'documento_rif') {
        formData.value.documento_rif = null;
        rifFileName.value = '';
        rifFileSelected.value = false;
        rifFilePreview.value = '';
        
        // Resetear el input file
        const fileInput = document.getElementById('documento_rif');
        if (fileInput) fileInput.value = '';
      } else if (fileType === 'registro_mercantil') {
        formData.value.registro_mercantil = null;
        registroFileName.value = '';
        registroFileSelected.value = false;
        registroFilePreview.value = '';
        
        // Resetear el input file
        const fileInput = document.getElementById('registro_mercantil');
        if (fileInput) fileInput.value = '';
      }
    };
    
    // Función para manejar el registro
    const handleRegister = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';
        successMessage.value = '';
        
        // Validar que se hayan subido los archivos requeridos
        if (!formData.value.documento_rif) {
          errorMessage.value = 'Debe subir una imagen del documento RIF';
          isLoading.value = false;
          return;
        }
        
        if (!formData.value.registro_mercantil) {
          errorMessage.value = 'Debe subir una imagen del Registro Mercantil';
          isLoading.value = false;
          return;
        }
        
        // Crear FormData para enviar archivos
        const formDataToSend = new FormData();
        
        // Agregar todos los campos del formulario
        for (const key in formData.value) {
          if (formData.value[key] !== null) {
            formDataToSend.append(key, formData.value[key]);
          }
        }
        
        // Agregar contraseña
        formDataToSend.append('password', password.value);
        
        // Enviar datos al servidor
        const response = await fetch('http://localhost:3000/api/usuarios/create', {
          method: 'POST',
          body: formDataToSend
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar usuario');
        }
        
        // Registro exitoso
        successMessage.value = 'Usuario registrado correctamente';
        
        // Redireccionar después de un tiempo
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        
      } catch (error) {
        console.error('Error de registro:', error);
        errorMessage.value = error.message || 'Error al registrar usuario';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      formData,
      password,
      showPassword,
      rifFileSelected,
      rifFileName,
      rifFilePreview,
      registroFileSelected,
      registroFileName,
      registroFilePreview,
      acceptTerms,
      isLoading,
      errorMessage,
      successMessage,
      passwordStrength,
      strengthClass,
      strengthText,
      togglePassword,
      handleFileUpload,
      removeFile,
      handleRegister
    };
  }
};