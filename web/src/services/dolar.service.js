// dolar.service.js
import { apiService } from "./api.service"
import { useAuth } from "../composables/useAuth"

export const useDolarService = () => {
    const auth = useAuth()

    const getToken = () => {
        return auth.sessionToken.value
    }

    // Fetch dollar rate from external API
    const fetchDollarRateFromAPI = async () => {
        try {
            const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial')
            if (!response.ok) throw new Error('Failed to fetch from external API')
            const data = await response.json()

            if (data.promedio) {
                return {
                    rate: parseFloat(data.promedio),
                    updatedAt: new Date(data.fechaActualizacion),
                    source: 'API'
                }
            }
            return null
        } catch (error) {
            console.error('Error fetching dollar rate from API:', error)
            return null
        }
    }

    // Get all exchange rates from our DB
    const getAllExchangeRates = async () => {
        try {
            const response = await apiService.get('/dolar-bcv', getToken())
            return response.data || []
        } catch (error) {
            console.error('Error fetching all exchange rates:', error)
            throw error
        }
    }

    // Get current active exchange rate from our DB
    const getCurrentExchangeRate = async () => {
        try {
            const response = await apiService.get('/dolar-bcv/current')
            if (response.data === null) {
                return null
            }
            return response.data || null
        } catch (error) {
            if (!error.message.includes('No active exchange rate found')) {
                console.error('Error fetching current exchange rate:', error)
                throw error
            }
            return null
        }
    }

    // Create new exchange rate
    const createExchangeRate = async (tasa_cambio) => {
        try {
            const response = await apiService.post(
                '/dolar-bcv',
                getToken(),
                { tasa_cambio }
            )
            return response.data || null
        } catch (error) {
            console.error('Error creating exchange rate:', error)
            throw error
        }
    }

    // Update exchange rate
    const updateExchangeRate = async (id, data) => {
        try {
            const response = await apiService.put(
                `/dolar-bcv/${id}`,
                getToken(),
                data
            )
            return response.data || null
        } catch (error) {
            console.error('Error updating exchange rate:', error)
            throw error
        }
    }

    // Get the most recent dollar rate (combines API and DB checks)
    const getMostRecentDollarRate = async () => {
        try {
            const [apiRate, dbRate] = await Promise.allSettled([
                fetchDollarRateFromAPI(),
                getCurrentExchangeRate()
            ])

            // Extraer valores de las promesas resueltas
            const apiResult = apiRate.status === 'fulfilled' ? apiRate.value : null
            const dbResult = dbRate.status === 'fulfilled' ? dbRate.value : null

            // Si tenemos tasa en DB y es más reciente que la API (o la API falló)
            if (dbResult && (!apiResult || (dbResult.fecha_inicio && new Date(dbResult.fecha_inicio) >= apiResult.updatedAt))) {
                return {
                    rate: parseFloat(dbResult.tasa_cambio),
                    updatedAt: new Date(dbResult.fecha_inicio),
                    source: 'DB',
                    id: dbResult.id
                }
            }
            // Si tenemos tasa de la API (y no hay en DB o es más reciente)
            else if (apiResult) {
                return apiResult
            }

            return null
        } catch (error) {
            console.error('Error getting most recent dollar rate:', error)
            return null
        }
    }

    return {
        fetchDollarRateFromAPI,
        getAllExchangeRates,
        getCurrentExchangeRate,
        createExchangeRate,
        updateExchangeRate,
        getMostRecentDollarRate
    }
}