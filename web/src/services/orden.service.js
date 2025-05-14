import { config } from '../config/config'

export const ordenService = {
  // Obtener todas las órdenes
  getAllOrdenes: async (token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching ordenes:", error)
      return { success: false, message: "Error al obtener las órdenes" }
    }
  },

  // Obtener orden por ID
  getOrdenById: async (id, token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching orden:", error)
      return { success: false, message: "Error al obtener la orden" }
    }
  },

  // Obtener órdenes por usuario
  getOrdenesByUsuario: async (usuarioId, token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes/usuario/${usuarioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching ordenes by usuario:", error)
      return { success: false, message: "Error al obtener las órdenes del usuario" }
    }
  },

  // Crear una nueva orden
  createOrden: async (ordenData, token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ordenData),
      })
      return await response.json()
    } catch (error) {
      console.error("Error creating orden:", error)
      return { success: false, message: "Error al crear la orden" }
    }
  },

  // Actualizar estado de la orden
  updateOrdenStatus: async (id, statusData, token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusData),
      })
      return await response.json()
    } catch (error) {
      console.error("Error updating orden status:", error)
      return { success: false, message: "Error al actualizar el estado de la orden" }
    }
  },

  // Cancelar orden
  cancelOrden: async (id, token) => {
    try {
      const response = await fetch(`${config.API_URL}/ordenes/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await response.json()
    } catch (error) {
      console.error("Error cancelling orden:", error)
      return { success: false, message: "Error al cancelar la orden" }
    }
  },
}