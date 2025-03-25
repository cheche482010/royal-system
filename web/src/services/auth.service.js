const API_URL = 'http://localhost:3000/api'

export const authService = {
  async login(documento, password) {
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documento,
          user_password: password
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al iniciar sesión')
      }

      return await response.json()
    } catch (error) {
      console.error('Error en servicio de autenticación:', error)
      throw error
    }
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/sesiones/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      
      return response.ok
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  },

  getAuthHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
}