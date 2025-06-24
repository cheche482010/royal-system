import { config } from '../config/config'

export const apiService = {

  async searchProducts(query = '', categoriaId = null, marcaId = null) {
    let endpoint = '/productos/search?'
    if (query) endpoint += `query=${encodeURIComponent(query)}&`
    if (categoriaId) endpoint += `categoria_id=${categoriaId}&`
    if (marcaId) endpoint += `marca_id=${marcaId}&`
    return this.get(endpoint)
  },

  async getProductById(id) {
    return this.get(`/productos/${id}`)
  },

  async request(method, endpoint, token, data = null) {
    try {
      const options = {
        method,
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      }

      // Solo agrega Content-Type si NO es FormData
      if (data && (method === 'POST' || method === 'PUT')) {
        if (data instanceof FormData) {
          options.body = data
          // No agregues Content-Type, el navegador lo pone automáticamente
        } else {
          options.headers['Content-Type'] = 'application/json'
          options.body = JSON.stringify(data)
        }
      }

      const response = await fetch(`${config.API_URL}${endpoint}`, options)
      const responseData = await response.json()

      if (responseData.success === false) {
        return responseData
      }

      if (!response.ok && response.status !== 400) {
        throw new Error(responseData.message || `Error en petición ${method} a ${endpoint}`)
      }

      return responseData
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