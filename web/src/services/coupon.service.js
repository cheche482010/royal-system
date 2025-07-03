"use client"

import { apiService } from "./api.service"
import { useAuth } from "../composables/useAuth"
import { useToast } from "./toast.service"

export const useCouponService = () => {
  const auth = useAuth()
  const toast = useToast()

  const getToken = () => {
    return auth.userToken.value
  }

  const getUserId = () => {
    return auth.userId.value
  }

  const validateCoupon = async (code) => {
    try {
      const token = getToken()
      if (!token) {
        toast.error("Debes iniciar sesión para usar cupones")
        return { success: false, message: "Authentication required" }
      }
  
      const response = await apiService.post("/coupons/validate", token, {
        codigo: code
      })
  
      if (response.success === false) {
        return response
      }
  
      if (!response.success) {
        throw new Error(response.message || "Error al validar cupón")
      }
  
      return {
        success: true,
        data: response.data,
        message: "Cupón aplicado correctamente"
      }
    } catch (error) {
      console.error("Error al validar cupón:", error)
      return {
        success: false,
        message: error.message || "Error al validar cupón"
      }
    }
  }

  const applyCoupon = async (data) => {
    try {
      const token = getToken()
      if (!token) {
        toast.error("Debes iniciar sesión para usar cupones")
        return { success: false, message: "Authentication required" }
      }
  
      const response = await apiService.post("/coupons/apply", token, data)
  
      if (!response.success) {
        throw new Error(response.message || "Error al aplicar cupón")
      }
  
      return {
        success: true,
        data: response.data,
        message: "Cupón aplicado correctamente"
      }
    } catch (error) {
      console.error("Error al aplicar cupón:", error)
      return {
        success: false,
        message: error.message || "Error al aplicar cupón"
      }
    }
  }

  return {
    validateCoupon,
    applyCoupon
  }
}