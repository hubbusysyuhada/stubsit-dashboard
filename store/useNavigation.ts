import { AllGroupResponse } from '@/types/global'
import { create } from 'zustand'

type UseNavigationType = {
  groups: AllGroupResponse;
  isGroupsLoaded: boolean;
  fetchGroups: () => Promise<void>;
  getFilteredGroups: (keyword: string) => AllGroupResponse;
}

export default create<UseNavigationType>()((set, get) => ({
  groups: [],
  isGroupsLoaded: false,
  fetchGroups: async () => {
    set({ isGroupsLoaded: false })
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master`)
    const { data: groups }: { data: AllGroupResponse } = await response.json()
    if (groups) {
      groups.forEach(group => {
        group.endpoints.forEach(endpoint => {
          endpoint.calls.sort((prev, next) => prev.id - next.id)
        })
      })
      set({ groups })
    }
    set({ isGroupsLoaded: true })
  },
  getFilteredGroups: (keyword: string) => {
    const all = get().groups
    if (!keyword) return all
    return all.filter(group => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${group.slug}`
      const urls: string[] = [group.name.toLowerCase()]
      group.endpoints.forEach(endpoint => {
        urls.push(endpoint.name.toLowerCase())
        endpoint.calls.forEach(call => urls.push(`${baseUrl}/${call.slug}`))
      })
      return urls.some(url => url.includes(keyword))
    })
  },
}))
