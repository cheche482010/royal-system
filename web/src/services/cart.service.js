"use client"

import { apiService } from "./api.service"
import { useAuth } from "../composables/useAuth"

export const useCartService = () => {
  const auth = useAuth()

  // Obtener el token del usuario autenticado
  const getToken = () => {
    return auth.userToken.value
  }

  // Obtener el ID del usuario autenticado
  const getUserId = () => {
    return auth.userId.value
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!auth.userToken.value && !!auth.userId.value
  }

  // Obtener todos los items del carrito del usuario actual
  const getCartItems = async () => {
    try {
      const token = getToken()
      const userId = getUserId()

      if (!token || !userId) {
        return getLocalCartItems()
      }

      const response = await apiService.get(`/cart/usuario/${userId}`, token)
      if (!response.success || !response.data) {
        throw new Error("Error al obtener los items del carrito")
      }

      const cartItems = response.data.map((item) => ({
        id: item.id,
        productId: item.producto_id,
        name: item.Producto?.nombre || "Producto",
        brand: item.Producto?.Marca?.nombre || "Sin marca",
        price: item.Producto?.precio_unidad || 0,
        quantity: item.cantidad,
        image: item.Producto?.producto_img || "/placeholder.jpg",
      }))

      updateCartCount(cartItems.length)

      return cartItems
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
      return getLocalCartItems()
    }
  }

  // Modificar la función addToCart para verificar si el usuario está autenticado
  const addToCart = async (product, quantity = 1) => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        return {
          success: false,
          authenticated: false,
          message: "Debes iniciar sesión para agregar productos al carrito",
        }
      }

      const token = getToken()
      const userId = getUserId()

      // Primero verificar si el producto ya está en el carrito
      const cartItems = await getCartItems()
      const existingItem = cartItems.find((item) => item.productId === product.id)

      if (existingItem) {
        // Si el producto ya está en el carrito, retornar un objeto con información
        return {
          success: false,
          alreadyInCart: true,
          message: "Este producto ya está en tu carrito",
          item: existingItem,
        }
      }

      const response = await apiService.post("/cart/addToCart", token, {
        usuario_id: userId,
        producto_id: product.id,
        cantidad: quantity,
      })

      if (!response.success) {
        throw new Error(response.message || "Error al agregar al carrito")
      }

      // Actualizar el contador del carrito y notificar a los componentes
      notifyCartUpdated()

      return {
        success: true,
        alreadyInCart: false,
        message: "Producto agregado al carrito",
        data: response.data,
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      return {
        success: false,
        message: "Error al agregar al carrito: " + error.message,
      }
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        return {
          success: false,
          authenticated: false,
          message: "Debes iniciar sesión para actualizar productos en el carrito",
        }
      }

      const token = getToken()
      const response = await apiService.put(`/cart/update/${itemId}`, token, {
        cantidad: quantity,
      })

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar el carrito")
      }

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error)
      return {
        success: false,
        message: "Error al actualizar el carrito: " + error.message,
      }
    }
  }

  // Eliminar un producto del carrito
  const removeFromCart = async (itemId) => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        return {
          success: false,
          authenticated: false,
          message: "Debes iniciar sesión para eliminar productos del carrito",
        }
      }

      const token = getToken()
      
      // Usar el endpoint de CarritoProductoController en lugar del CarritoController
      const response = await apiService.delete(`/cart-products/${itemId}`, token)

      if (!response.success) {
        throw new Error(response.message || "Error al eliminar del carrito")
      }

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error)
      return {
        success: false,
        message: "Error al eliminar del carrito: " + error.message,
      }
    }
  }

  // Vaciar el carrito
  const clearCart = async () => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        return {
          success: false,
          authenticated: false,
          message: "Debes iniciar sesión para vaciar el carrito",
        }
      }

      const token = getToken()
      const userId = getUserId()
      
      // Primero obtener el carrito activo del usuario
      const response = await apiService.get(`/cart/usuario/${userId}`, token)
      if (!response.success || !response.data || response.data.length === 0) {
        return {
          success: true,
          message: "El carrito ya está vacío",
        }
      }
      
      // Obtener el ID del carrito
      try {
        const carrito = await Carrito.findOne({
          where: { usuario_id: userId, is_delete: false, is_active: true },
        })
        
        if (!carrito) {
          return {
            success: true,
            message: "El carrito ya está vacío",
          }
        }
        
        // Usar el endpoint de CarritoProductoController para limpiar el carrito
        const clearResponse = await apiService.delete(`/cart-products/clear/${carrito.id}`, token)

        if (!clearResponse.success) {
          throw new Error(clearResponse.message || "Error al vaciar el carrito")
        }

        // Actualizar el contador a cero
        updateCartCount(0)
        
        // Notificar a los componentes sobre la actualización
        notifyCartUpdated()

        return {
          success: true,
          data: clearResponse.data,
        }
      } catch (error) {
        console.error("Error al buscar o vaciar el carrito:", error)
        return {
          success: false,
          message: "Error al buscar o vaciar el carrito: " + error.message,
        }
      }
    } catch (error) {
      console.error("Error al vaciar el carrito:", error)
      return {
        success: false,
        message: "Error al vaciar el carrito: " + error.message,
      }
    }
  }

  // Funciones para el carrito local (localStorage) - Ya no se utilizan con la validación de autenticación
  const getLocalCartItems = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || []
      updateCartCount(cart.length)
      return cart
    } catch (error) {
      console.error("Error al obtener el carrito local:", error)
      return []
    }
  }

  // Actualizar el contador del carrito y notificar a los componentes
  const updateCartCount = (count) => {
    localStorage.setItem("cartCount", count.toString())
  }

  // Notificar a los componentes sobre la actualización del carrito
  const notifyCartUpdated = () => {
    window.dispatchEvent(new CustomEvent("cart-updated"))
  }

  return {
    getCartItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    updateCartCount,
    notifyCartUpdated,
    isAuthenticated,
  }
}