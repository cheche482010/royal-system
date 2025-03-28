import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-vue-next';

export default {
  name: 'Toast',
  components: {
    CheckCircleIcon,
    XCircleIcon,
    InfoIcon,
    XIcon
  },
  props: {
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const visible = ref(true);
    let timer = null;

    const close = () => {
      visible.value = false;
      props.onClose();
    };

    onMounted(() => {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          close();
        }, props.duration);
      }
    });

    onBeforeUnmount(() => {
      if (timer) {
        clearTimeout(timer);
      }
    });

    return {
      visible,
      close
    };
  }
}