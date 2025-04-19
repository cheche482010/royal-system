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
            const response = await apiService.get('/dolar-bcv/current', getToken())
            return response.data || null
        } catch (error) {
            console.error('Error fetching current exchange rate:', error)
            throw error
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
            const [apiRate, dbRate] = await Promise.all([
                fetchDollarRateFromAPI(),
                getCurrentExchangeRate()
            ])

            // If we have a DB rate and it's newer than API rate (or API failed)
            if (dbRate && (!apiRate || new Date(dbRate.fecha_inicio) >= apiRate.updatedAt)) {
                return {
                    rate: parseFloat(dbRate.tasa_cambio),
                    updatedAt: new Date(dbRate.fecha_inicio),
                    source: 'DB',
                    id: dbRate.id
                }
            } 
            // If we have API rate (and either no DB rate or API is newer)
            else if (apiRate) {
                return apiRate
            }

            return null
        } catch (error) {
            console.error('Error getting most recent dollar rate:', error)
            throw error
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