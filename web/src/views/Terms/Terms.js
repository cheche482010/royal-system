import { ref } from 'vue';
import Header from '../../components/Header/Header.vue';
import Footer from '../../components/Footer/Footer.vue';
export default {
  name: 'TermsAndConditions',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      activeSection: 'Términos y Condiciones',
      sectionNames: {
        terminos: 'Términos y Condiciones',
        item2: 'Item 2',
        item3: 'Item 3'
      }
    }
  },
}