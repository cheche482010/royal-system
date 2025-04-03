import { ref, computed } from 'vue';
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

    const logo = ref({
      image: new URL('../../assets/img/logo.jpg', import.meta.url).href,
      name: 'Pet Shop'
    });
    
    return {
      email,
      logo,
      currentYear,
      subscribeNewsletter
    };
  }
};