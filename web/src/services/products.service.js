"use client";

import { apiService } from "./api.service";
import { useAuth } from "../composables/useAuth";

export const useProductsService = () => {
  const auth = useAuth();

  const getToken = () => {
    return auth.userToken.value;
  };

  const getUserId = () => {
    return auth.userId.value;
  };

  const getAllProducts = async () => {
    try {
      const response = await apiService.get("/productos/getAll");
      // Filtrar productos con inventario > 0 antes de devolverlos
      if (response && response.data) {
        response.data = response.data.filter(
          (product) =>
            product.Inventario && product.Inventario.cantidad_actual > 0
        );
      }
      return response;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  };

  const searchProducts = async (
    query = "",
    categoriaId = null,
    marcaId = null,
    precio = null
  ) => {
    try {
      let endpoint = "/productos/search?";
      if (query) endpoint += `query=${encodeURIComponent(query)}&`;
      if (categoriaId) endpoint += `categoria_id=${categoriaId}&`;
      if (marcaId) endpoint += `marca_id=${marcaId}&`;
      if (precio) endpoint += `precio=${precio}&`;

      const response = await apiService.get(endpoint);
      // Filtrar productos con inventario > 0 antes de devolverlos
      if (response && response.data) {
        response.data = response.data.filter(
          (product) =>
            product.Inventario && product.Inventario.cantidad_actual > 0
        );
      }
      return response.data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await apiService.get(`/productos/${id}`);
      return response.data || null;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  };

  return {
    getAllProducts,
    searchProducts,
    getProductById,
  };
};
