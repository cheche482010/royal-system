import { apiService } from "./api.service"
import { useAuth } from "../composables/useAuth"

export const useNotificacionService = () => {
  const auth = useAuth()

  const getToken = () => {
    return auth.userToken.value
  }

  const getUserId = () => {
    return auth.userId.value
  }

  // Obtener todas las notificaciones del usuario
  const getNotificaciones = async () => {
    try {
      const token = getToken()
      const userId = getUserId()
      
      if (!token || !userId) {
        return { success: false, message: "Usuario no autenticado" }
      }

      const response = await apiService.get(`/notificaciones/usuario/${userId}`, token)
      return response
    } catch (error) {
      console.error("Error al obtener notificaciones:", error)
      return { success: false, message: "Error al obtener notificaciones" }
    }
  }

  // Obtener conteo de notificaciones no leídas
  const getConteoNoLeidas = async () => {
    try {
      const token = getToken()
      const userId = getUserId()
      
      if (!token || !userId) {
        return { success: false, data: { conteo: 0 } }
      }

      const response = await apiService.get(`/notificaciones/usuario/${userId}/conteo-no-leidas`, token)
      return response
    } catch (error) {
      console.error("Error al obtener conteo de notificaciones:", error)
      return { success: false, data: { conteo: 0 } }
    }
  }

  // Marcar una notificación como leída
  const marcarComoLeida = async (notificacionId) => {
    try {
      const token = getToken()
      
      if (!token) {
        return { success: false, message: "Usuario no autenticado" }
      }

      const response = await apiService.put(`/notificaciones/${notificacionId}/marcar-leida`, token)
      return response
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
      return { success: false, message: "Error al marcar notificación como leída" }
    }
  }

  // Marcar todas las notificaciones como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      const token = getToken()
      const userId = getUserId()
      
      if (!token || !userId) {
        return { success: false, message: "Usuario no autenticado" }
      }

      const response = await apiService.put(`/notificaciones/usuario/${userId}/marcar-todas-leidas`, token)
      return response
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
      return { success: false, message: "Error al marcar todas las notificaciones como leídas" }
    }
  }

  // Eliminar una notificación
  const eliminarNotificacion = async (notificacionId) => {
    try {
      const token = getToken()
      
      if (!token) {
        return { success: false, message: "Usuario no autenticado" }
      }

      const response = await apiService.delete(`/notificaciones/${notificacionId}`, token)
      return response
    } catch (error) {
      console.error("Error al eliminar notificación:", error)
      return { success: false, message: "Error al eliminar notificación" }
    }
  }

  return {
    getNotificaciones,
    getConteoNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
  }
}