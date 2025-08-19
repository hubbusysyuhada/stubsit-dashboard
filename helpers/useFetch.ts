import { useCallback } from 'react'

type ErrorType = { error: string; message: string; statusCode: number }
export default function useFetch<T>(url: string, options?: RequestInit) {
  return useCallback(async () => {
    const result: { data?: T; error?: ErrorType } = {}
    try {
      const response = await fetch(url, options)
      const parsed = await response.json()
      if (parsed.error) throw parsed
      result.data = parsed.data
    } catch (err) {
      result.error = err as ErrorType
    }
    return result
  }, [url, options])
}