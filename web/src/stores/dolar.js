// stores/dolar.js
import { ref } from 'vue'

const dollarRate = ref(null)
const dollarSource = ref('')

export function useDolarStore() {
  const setDolarRate = (rate, source) => {
    dollarRate.value = rate
    dollarSource.value = source
  }

  return {
    dollarRate,
    dollarSource,
    setDolarRate
  }
}