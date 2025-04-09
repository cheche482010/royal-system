import { ref, computed } from 'vue';
import { config } from '../../config/config';
import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  SendIcon
} from 'lucide-vue-next';

export default {
  name: 'Footer',
  components: {
    FacebookIcon, 
    InstagramIcon, 
    TwitterIcon, 
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    ClockIcon,
    SendIcon
  },
  props: {
    ASSETS: {
      type: Object,
      default: () => config.ASSETS.LOGO
    }
  },
  setup() {
    const email = ref('');
    
    const currentYear = computed(() => {
      return new Date().getFullYear();
    });
    
    const subscribeNewsletter = () => {
      // Aquí iría la lógica para suscribir al usuario al newsletter
      alert(`Gracias por suscribirte con: ${email.value}`);
      email.value = '';
    };

    return {
      email,
      currentYear,
      subscribeNewsletter
    };
  }
};