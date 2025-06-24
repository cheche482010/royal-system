import { apiService } from "./api.service"

export const userService = {
  // Obtener el perfil del usuario actual (usando el ID del usuario autenticado)
  async getUserProfile(token) {
    try {
      const userId = this.getUserIdFromToken(token)
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario desde el token")
      }
      return await this.getUserById(userId, token)
    } catch (error) {
      console.error("Error al obtener perfil de usuario:", error)
      throw error
    }
  },

  // Extraer el ID del usuario del token (implementación básica)
  getUserIdFromToken(token) {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        return user.id
      }
      return null
    } catch (error) {
      console.error("Error al extraer ID del usuario:", error)
      return null
    }
  },

  // Obtener un usuario por ID
  async getUserById(id, token) {
    try {
      return await apiService.get(`/usuarios/${id}`, token)
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error)
      throw error
    }
  },

  // Actualizar el perfil del usuario
  async updateUserProfile(userData, token) {
    try {
      const userId = this.getUserIdFromToken(token)
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario desde el token")
      }
      return await apiService.put(`/usuarios/update/${userId}`, token, userData) 
    } catch (error) {
      console.error("Error al actualizar perfil de usuario:", error)
      throw error
    }
  },

  // Actualizar la contraseña del usuario
  async updatePassword(passwordData, token) {
    try {
      const userId = this.getUserIdFromToken(token)
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario desde el token")
      }
      return await apiService.put(`/usuarios/${userId}`, token, {
        user_password: passwordData.new_password,
      })
    } catch (error) {
      console.error("Error al actualizar contraseña:", error)
      throw error
    }
  },

  // Obtener todos los usuarios (solo para administradores)
  async getAllUsers(token) {
    try {
      return await apiService.get("/usuarios", token)
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error)
      throw error
    }
  },

  async updatePassword(passwordData, token) {
    try {
      const userId = this.getUserIdFromToken(token);
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario desde el token");
      }

      // Enviar tanto la contraseña actual como la nueva
      return await apiService.put(`/usuarios/${userId}`, token, {
        current_password: passwordData.current_password,
        user_password: passwordData.new_password,
      });
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      throw error;
    }
  },
}
