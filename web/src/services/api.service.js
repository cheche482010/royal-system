const API_URL = 'http://localhost:3000/api'

export const apiService = {
  async request(method, endpoint, token, data = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(`${API_URL}${endpoint}`, options)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error en petición ${method} a ${endpoint}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error en ${method} ${endpoint}:`, error)
      throw error
    }
  },

  get(endpoint, token) {
    return this.request('GET', endpoint, token)
  },
  
  post(endpoint, token, data) {
    return this.request('POST', endpoint, token, data)
  },
  
  put(endpoint, token, data) {
    return this.request('PUT', endpoint, token, data)
  },
  
  delete(endpoint, token) {
    return this.request('DELETE', endpoint, token)
  }
}