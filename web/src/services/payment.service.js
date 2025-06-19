import { apiService } from './api.service'
import { config } from '../config/config'

export const usePaymentService = () => {
  /**
   * Process a payment for an order
   * @param {FormData} formData - Form data containing payment details and receipt image
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Response from the API
   */
  const processPayment = async (formData, token) => {
    try {

      // Proceed with payment processing
      const response = await fetch(`${config.API_URL}/pagos/makepayment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  /**
   * Obtener pago por ID
   */
  const getPaymentById = async (id, token) => {
    try {
      const response = await apiService.get(`/pagos/${id}`, token)
      if (!response || response.success === false) {
        throw new Error(response?.message || 'No se pudo obtener el pago')
      }
      return response
    } catch (error) {
      console.error('Error en getPaymentById:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Obtener pagos por ID de orden
   */
  const getPaymentsByOrderId = async (orderId, token) => {
    try {
      const response = await apiService.get(`/pagos/orden/${orderId}`, token)
      if (!response || response.success === false) {
        throw new Error(response?.message || 'No se pudieron obtener los pagos de la orden')
      }
      return response
    } catch (error) {
      console.error('Error en getPaymentsByOrderId:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Obtener todos los pagos (solo admin)
   */
  const getAllPayments = async (token) => {
    try {
      const response = await apiService.get('/pagos', token)
      if (!response || response.success === false) {
        throw new Error(response?.message || 'No se pudieron obtener los pagos')
      }
      return response
    } catch (error) {
      console.error('Error en getAllPayments:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    processPayment,
    getPaymentById,
    getPaymentsByOrderId,
    getAllPayments
  }
}