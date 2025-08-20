import useFetch from '@/helpers/useFetch'
import { AllEndpointResponse, BaseEndpointType } from '@/types/global'
import { create } from 'zustand'

type UseNavigationType = {
  endpoints: AllEndpointResponse;
  isEndpointsLoaded: boolean;
  fetchEndpoints: () => Promise<void>;
  getFilteredEndpoints: (keyword: string) => AllEndpointResponse;
}

export default create<UseNavigationType>()((set, get) => ({
  endpoints: [],
  isEndpointsLoaded: false,
  fetchEndpoints: async () => {
    set({ isEndpointsLoaded: false })
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master`)
    const { data: endpoints }: { data: AllEndpointResponse } = await response.json()
    if (endpoints) set({ endpoints })
    set({ isEndpointsLoaded: true })
  },
  getFilteredEndpoints: (keyword: string) => {
    const all = get().endpoints
    if (!keyword) return all
    return all.filter(endpoint => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint.slug}`
      const urls: string[] = [endpoint.name.toLowerCase()]
      endpoint.calls.forEach(call => urls.push(`${baseUrl}/${call.slug}`))
      return urls.some(url => url.includes(keyword))
    })
  },
}))
