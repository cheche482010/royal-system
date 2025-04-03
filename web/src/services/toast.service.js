import { ref, h, render } from 'vue';
import Toast from '../components/Toast/Toast.vue';

const toasts = ref([]);
let toastId = 0;

export const useToast = () => {
  const createToast = (props) => {
    const id = toastId++;
    
    // Crear un div para el toast
    const container = document.createElement('div');
    container.id = `toast-${id}`;
    document.body.appendChild(container);
    
    // Función para eliminar el toast
    const removeToast = () => {
      setTimeout(() => {
        render(null, container);
        document.body.removeChild(container);
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 300); // Dar tiempo para la animación de salida
    };
    
    // Renderizar el componente Toast
    const vnode = h(Toast, {
      ...props,
      onClose: () => {
        if (props.onClose) props.onClose();
        removeToast();
      }
    });
    
    render(vnode, container);
    
    // Agregar el toast a la lista
    toasts.value.push({ id, close: removeToast });
    
    return {
      id,
      close: removeToast
    };
  };
  
  const success = (message, options = {}) => {
    return createToast({
      type: 'success',
      title: options.title || 'Éxito',
      message,
      duration: options.duration || 3000,
      onClose: options.onClose
    });
  };
  
  const error = (message, options = {}) => {
    return createToast({
      type: 'error',
      title: options.title || 'Error',
      message,
      duration: options.duration || 3000,
      onClose: options.onClose
    });
  };
  
  const info = (message, options = {}) => {
    return createToast({
      type: 'info',
      title: options.title || 'Información',
      message,
      duration: options.duration || 3000,
      onClose: options.onClose
    });
  };
  
  const closeAll = () => {
    toasts.value.forEach(toast => toast.close());
  };
  
  return {
    success,
    error,
    info,
    closeAll
  };
};