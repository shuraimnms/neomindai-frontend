import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const callApi = useCallback(async (apiCall, successMessage = null) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      setData(response.data.data)
      
      if (successMessage) {
        toast.success(successMessage)
      }
      
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      setError(errorMessage)
      toast.error(errorMessage)
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    callApi,
    reset,
    setLoading,
    setError,
    setData,
  }
}