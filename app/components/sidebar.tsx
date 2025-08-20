'use client'

import Logo from '@/app/components/logo'
import { CiSearch } from 'react-icons/ci'
import { IoAdd } from 'react-icons/io5'
import { FaRegCircleXmark as Cancel } from "react-icons/fa6";
import { Input, Button, Skeleton, Textarea, Snackbar } from '@mui/joy'
import Menu from './menu'
import { useEffect, useState } from 'react'
import useNavigation from '@/store/useNavigation';
import CreateEndpointDrawer from './createEndpointDrawer'
import { useRouter } from 'next/navigation'
import { AllEndpointResponse } from '@/types/global'
import useDebounce from '@/helpers/useDebounce'

export default function SidebarLayout() {
  const router = useRouter()
  const { endpoints: storeEndpoints, isEndpointsLoaded, fetchEndpoints, getFilteredEndpoints } = useNavigation()
  const [endpoints, setEndpoints] = useState<AllEndpointResponse>([])
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false)

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    fetchEndpoints()
  }, [])

  useEffect(() => {
    setEndpoints(storeEndpoints)
  }, [storeEndpoints])

  useEffect(() => {
    setEndpoints(getFilteredEndpoints(debouncedKeyword))
  }, [debouncedKeyword]);

  const renderMenu = () => {
    if (!endpoints.length && !isEndpointsLoaded) return Array.from({ length: 5 }).map((_, index) => (
      <div className="w-full mt-4 h-[36px] rounded-lg relative" key={index}>
        <Skeleton loading animation="wave"/>
      </div>
    ))
    return endpoints?.map((endpoint, index) => <Menu {...endpoint} key={'menu-' + index} />)
  }

  return (
    <>
      <div id="sidebar" className="flex flex-col justify-between pb-9 relative !w-[360px] !min-w-[360px] px-4">
        <div>
          <div className='relative w-[150px] h-[80px] icon hover:cursor-pointer' onClick={() => router.push('/')}>
            <Logo />
          </div>
          <div className="searchbar">
            <Input
              placeholder="Search Endpoints"
              variant="soft"
              startDecorator={<CiSearch />}
              endDecorator={keyword ? <Cancel onClick={() => setKeyword('')} className="hover:cursor-pointer" /> : null}
              className="my-4"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="menu max-h-[calc(100vh-280px)] overflow-y-auto">
            {renderMenu()}
          </div>
        </div>

        <div className="footer">
          <Button
            color="neutral"
            onClick={() => setOpenCreateDrawer(true)}
            variant="solid"
            className='w-full primary'
            startDecorator={<IoAdd />}
          >
            New Endpoint
          </Button>
          <div className="flex justify-center mt-3">
            <p className="text-xs">© 2025 Hubbusysyuhada</p>
          </div>
        </div>
      </div>

      <CreateEndpointDrawer open={openCreateDrawer} onClose={() => setOpenCreateDrawer(false)} />
    </>
  )
}