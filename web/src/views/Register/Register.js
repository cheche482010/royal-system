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
    
    // Pasos del formulario
    const steps = [
      { name: 'Datos Personales' },
      { name: 'Contacto' },
      { name: 'Documentos' }
    ];
    
    const currentStep = ref(0);
    
    // Datos del formulario
    const formData = ref({
      documento: '',
      documento_img: null,
      nombre: '',
      direccion: '',
      registro_mercantil_img: null,
      correo: '',
      telefono: '',
    });
    
    // Estado de la contraseña
    const password = ref('');
    const showPassword = ref(false);
    
    // Estado de los archivos
    const documentoImgSelected = ref(false);
    const documentoImgName = ref('');
    const documentoImgPreview = ref('');
    
    const registroMercantilImgSelected = ref(false);
    const registroMercantilImgName = ref('');
    const registroMercantilImgPreview = ref('');
    
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
    
    const logo = ref({
      image: new URL('../../assets/img/logo.jpg', import.meta.url).href,
      name: 'Pet Shop'
    });

    // Navegación entre pasos
    const nextStep = () => {
      if (validateCurrentStep()) {
        if (currentStep.value < steps.length - 1) {
          currentStep.value++;
        }
      }
    };
    
    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };
    
    // Validación de pasos
    const validateCurrentStep = () => {
      errorMessage.value = '';
      
      // Validación del paso 1: Datos Personales
      if (currentStep.value === 0) {
        if (!formData.value.nombre) {
          errorMessage.value = 'Debe ingresar su nombre completo';
          return false;
        }
        if (!formData.value.documento) {
          errorMessage.value = 'Debe ingresar su documento (RIF o Cédula)';
          return false;
        }
        if (!password.value || password.value.length < 6) {
          errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
          return false;
        }
      }
      
      // Validación del paso 2: Contacto y Dirección
      else if (currentStep.value === 1) {
        if (!formData.value.telefono) {
          errorMessage.value = 'Debe ingresar su número de teléfono';
          return false;
        }
        if (!formData.value.correo) {
          errorMessage.value = 'Debe ingresar su correo electrónico';
          return false;
        }
        if (!formData.value.direccion) {
          errorMessage.value = 'Debe ingresar su dirección';
          return false;
        }
      }
      
      return true;
    };
    
    // Funciones para manejar la contraseña
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    
    // Funciones para manejar archivos
    const handleFileUpload = (fileType, event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      if (fileType === 'documento_img') {
        formData.value.documento_img = file;
        documentoImgName.value = file.name;
        documentoImgSelected.value = true;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
          documentoImgPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'registro_mercantil_img') {
        formData.value.registro_mercantil_img = file;
        registroMercantilImgName.value = file.name;
        registroMercantilImgSelected.value = true;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
          registroMercantilImgPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    
    const removeFile = (fileType) => {
      if (fileType === 'documento_img') {
        formData.value.documento_img = null;
        documentoImgName.value = '';
        documentoImgSelected.value = false;
        documentoImgPreview.value = '';
        
        // Resetear el input file
        const fileInput = document.getElementById('documento_img');
        if (fileInput) fileInput.value = '';
      } else if (fileType === 'registro_mercantil_img') {
        formData.value.registro_mercantil_img = null;
        registroMercantilImgName.value = '';
        registroMercantilImgSelected.value = false;
        registroMercantilImgPreview.value = '';
        
        // Resetear el input file
        const fileInput = document.getElementById('registro_mercantil_img');
        if (fileInput) fileInput.value = '';
      }
    };
    
    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
      if (!validateCurrentStep()) return;
      
      try {
        isLoading.value = true;
        errorMessage.value = '';
        successMessage.value = '';
        
        // Validar que se hayan subido los archivos requeridos
        if (!formData.value.documento_img) {
          errorMessage.value = 'Debe subir una imagen del documento';
          isLoading.value = false;
          return;
        }
        
        if (!formData.value.registro_mercantil_img) {
          errorMessage.value = 'Debe subir una imagen del Registro Mercantil';
          isLoading.value = false;
          return;
        }
        
        if (!acceptTerms.value) {
          errorMessage.value = 'Debe aceptar los términos y condiciones';
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
        formDataToSend.append('user_password', password.value);
        
        // Agregar fechas actuales
        const now = new Date().toISOString();
        formDataToSend.append('created_at', now);
        formDataToSend.append('updated_at', now);
        
        // Enviar datos al servidor
        const response = await fetch('http://localhost:3000/api/usuarios/register', {
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
      steps,
      currentStep,
      formData,
      password,
      showPassword,
      documentoImgSelected,
      documentoImgName,
      documentoImgPreview,
      registroMercantilImgSelected,
      registroMercantilImgName,
      registroMercantilImgPreview,
      acceptTerms,
      isLoading,
      errorMessage,
      successMessage,
      passwordStrength,
      strengthClass,
      strengthText,
      logo,
      nextStep,
      prevStep,
      togglePassword,
      handleFileUpload,
      removeFile,
      handleSubmit
    };
  }
};