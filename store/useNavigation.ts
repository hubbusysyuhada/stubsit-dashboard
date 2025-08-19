import useFetch from '@/helpers/useFetch'
import { AllEndpointResponse, BaseEndpointType } from '@/types/global'
import { create } from 'zustand'

type UseNavigationType = {
  endpoints: AllEndpointResponse;
  isEndpointsLoaded: boolean;
  fetchEndpoints: () => Promise<void>;
}

export default create<UseNavigationType>()((set) => ({
  endpoints: [],
  isEndpointsLoaded: false,
  fetchEndpoints: async () => {
    console.log("sini");
    set({ isEndpointsLoaded: false })
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master`)
    const { data: endpoints }: { data: AllEndpointResponse } = await response.json()
    if (endpoints) set({ endpoints })
    set({ isEndpointsLoaded: true })
  }
}))
