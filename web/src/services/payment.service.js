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
      const response = await fetch(`${config.API_URL}/pagos`, {
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
   * Get payment by ID
   * @param {number} id - Payment ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Payment data
   */
  const getPaymentById = async (id, token) => {
    return apiService.get(`/pagos/${id}`, token);
  };

  /**
   * Get payments by order ID
   * @param {number} orderId - Order ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Payments for the order
   */
  const getPaymentsByOrderId = async (orderId, token) => {
    return apiService.get(`/pagos/orden/${orderId}`, token);
  };

  /**
   * Get all payments (admin only)
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - All payments
   */
  const getAllPayments = async (token) => {
    return apiService.get('/pagos', token);
  };

  return {
    processPayment,
    getPaymentById,
    getPaymentsByOrderId,
    getAllPayments
  };
};