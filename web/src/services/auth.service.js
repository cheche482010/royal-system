import { apiService } from './api.service'

export const authService = {
  async login(documento, password) {
    try {
      const response = await apiService.post('/usuarios/login', null, {
        documento,
        user_password: password
      })
      
      return response
    } catch (error) {
      console.error('Error en servicio de autenticación:', error)
      throw error
    }
  },

  async verifyToken(token) {
    try {
      await apiService.post('/sesiones/verify', null, { token })
      return true
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  },
}