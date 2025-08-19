'use client'

import Logo from '@/app/components/logo'
import { CiSearch } from 'react-icons/ci'
import { IoAdd } from 'react-icons/io5'
import { Input, Button, Skeleton, Textarea, Snackbar } from '@mui/joy'
import Menu from './menu'
import { useEffect, useState } from 'react'
import useNavigation from '@/store/useNavigation';
import CreateEndpointDrawer from './createEndpointDrawer'
import { useRouter } from 'next/navigation'

export default function SidebarLayout() {
  const router = useRouter()
  const { endpoints, isEndpointsLoaded, fetchEndpoints } = useNavigation()
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false)

  useEffect(() => {
    fetchEndpoints()
  }, [])

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
      <div id="sidebar" className="flex flex-col justify-between pb-9 relative w-[360px] px-4">
        <div>
          <div className='relative w-[150px] h-[80px] icon hover:cursor-pointer' onClick={() => router.push('/')}>
            <Logo />
          </div>
          <div className="searchbar">
            <Input
              placeholder="Search Endpoints"
              variant="soft"
              startDecorator={<CiSearch />}
              className="my-4"
            />
          </div>
          <div className="menu">
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