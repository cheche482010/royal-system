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

  // Obtener todos los items del carrito del usuario actual
  const getCartItems = async () => {
    try {
      const token = getToken()
      const userId = getUserId()

      if (!token || !userId) {
        // Si no hay usuario autenticado, usar el carrito local
        return getLocalCartItems()
      }

      const response = await apiService.get(`/cart/usuario/${userId}`, token)
      if (!response.success || !response.data) {
        throw new Error("Error al obtener los items del carrito")
      }

      // Transformar los datos para que coincidan con el formato esperado
      const cartItems = response.data.map((item) => ({
        id: item.id,
        productId: item.producto_id,
        name: item.Producto?.nombre || "Producto",
        brand: item.Producto?.Marca?.nombre || "Sin marca",
        price: item.Producto?.precio_unidad || 0,
        quantity: item.cantidad,
        image: item.Producto?.producto_img || "/placeholder.jpg",
      }))

      // Actualizar el contador del carrito
      updateCartCount(cartItems.length)

      return cartItems
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
      // Si falla la API, intentar usar el carrito local
      return getLocalCartItems()
    }
  }

  // Modificar la función addToCart para verificar si el producto ya existe en el carrito

  // Reemplazar la función addToCart actual con esta versión actualizada:
  const addToCart = async (product, quantity = 1) => {
    try {
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

      if (!token || !userId) {
        // Si no hay usuario autenticado, usar el carrito local
        return addToLocalCart(product, quantity)
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
      // Si falla la API, intentar usar el carrito local
      return addToLocalCart(product, quantity)
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      const token = getToken()

      if (!token) {
        // Si no hay usuario autenticado, usar el carrito local
        return updateLocalCartItemQuantity(itemId, quantity)
      }

      const response = await apiService.put(`/cart/update/${itemId}`, token, {
        cantidad: quantity,
      })

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar el carrito")
      }

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return response.data
    } catch (error) {
      console.error("Error al actualizar el carrito:", error)
      // Si falla la API, intentar usar el carrito local
      return updateLocalCartItemQuantity(itemId, quantity)
    }
  }

  // Eliminar un producto del carrito
  const removeFromCart = async (itemId) => {
    try {
      const token = getToken()

      if (!token) {
        // Si no hay usuario autenticado, usar el carrito local
        return removeFromLocalCart(itemId)
      }

      const response = await apiService.delete(`/cart/removeFromCart/${itemId}`, token)

      if (!response.success) {
        throw new Error(response.message || "Error al eliminar del carrito")
      }

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return response.data
    } catch (error) {
      console.error("Error al eliminar del carrito:", error)
      // Si falla la API, intentar usar el carrito local
      return removeFromLocalCart(itemId)
    }
  }

  // Vaciar el carrito
  const clearCart = async () => {
    try {
      const token = getToken()
      const userId = getUserId()

      if (!token || !userId) {
        // Si no hay usuario autenticado, usar el carrito local
        return clearLocalCart()
      }

      const response = await apiService.delete(`/cart/clearCart/${userId}`, token)

      if (!response.success) {
        throw new Error(response.message || "Error al vaciar el carrito")
      }

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return response.data
    } catch (error) {
      console.error("Error al vaciar el carrito:", error)
      // Si falla la API, intentar usar el carrito local
      return clearLocalCart()
    }
  }

  // Funciones para el carrito local (localStorage)
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

  // Modificar la función addToLocalCart para verificar si el producto ya existe
  const addToLocalCart = (product, quantity = 1) => {
    try {
      // Crear el objeto del producto para el carrito
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price:
          typeof product.price === "string"
            ? Number.parseFloat(product.price.replace("$", "").replace(",", "."))
            : product.price,
        quantity: quantity,
        image: product.image,
      }

      // Obtener el carrito actual del localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || []

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cart.findIndex((item) => item.productId === cartItem.productId)

      if (existingItemIndex !== -1) {
        // Si ya existe, retornar información sin modificar el carrito
        notifyCartUpdated() // Asegurarse de que la UI se actualice
        return {
          success: false,
          alreadyInCart: true,
          message: "Este producto ya está en tu carrito",
          item: cart[existingItemIndex],
        }
      } else {
        // Si no existe, agregar al carrito
        cart.push(cartItem)
      }

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return {
        success: true,
        alreadyInCart: false,
        message: "Producto agregado al carrito",
        item: cartItem,
      }
    } catch (error) {
      console.error("Error al agregar al carrito local:", error)
      return {
        success: false,
        alreadyInCart: false,
        message: "Error al agregar al carrito",
        error: error.message,
      }
    }
  }

  const updateLocalCartItemQuantity = (itemId, quantity) => {
    try {
      // Obtener el carrito actual del localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || []

      // Buscar el item en el carrito
      const itemIndex = cart.findIndex((item) => item.id === itemId)

      if (itemIndex !== -1) {
        // Actualizar la cantidad
        cart[itemIndex].quantity = quantity

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart))

        // Notificar a los componentes sobre la actualización
        notifyCartUpdated()
      }

      return cart[itemIndex]
    } catch (error) {
      console.error("Error al actualizar el carrito local:", error)
      return null
    }
  }

  const removeFromLocalCart = (itemId) => {
    try {
      // Obtener el carrito actual del localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || []

      // Filtrar el item a eliminar
      cart = cart.filter((item) => item.id !== itemId)

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return true
    } catch (error) {
      console.error("Error al eliminar del carrito local:", error)
      return false
    }
  }

  const clearLocalCart = () => {
    try {
      // Vaciar el carrito en localStorage
      localStorage.setItem("cart", JSON.stringify([]))

      // Notificar a los componentes sobre la actualización
      notifyCartUpdated()

      return true
    } catch (error) {
      console.error("Error al vaciar el carrito local:", error)
      return false
    }
  }

  // Actualizar el contador del carrito y notificar a los componentes
  const updateCartCount = (count) => {
    localStorage.setItem("cartCount", count)
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
  }
}

