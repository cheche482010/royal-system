import { apiService } from './api.service'

export const authService = {
  async login(documento, password) {
    const response = await apiService.post('/usuarios/login', null, {
      documento,
      user_password: password
    })

    if (response.success === false) {
      throw new Error(response.message || 'Credenciales inválidas')
    }

    return response
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