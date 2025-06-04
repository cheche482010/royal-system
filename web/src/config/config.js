
const API_BASE_URL = 'http://localhost:3000'

export const config = {
  API_BASE_URL: API_BASE_URL,
  API_URL: `${API_BASE_URL}/api`,
  ASSETS: {
    LOGO: {
      image: new URL('../assets/img/logo.jpg', import.meta.url).href,
      name: 'Pet Shop'
    }
  }
}