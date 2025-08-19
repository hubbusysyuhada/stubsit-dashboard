'use client'

import Logo from '@/app/components/logo'
import { CiSearch } from 'react-icons/ci'
import { IoAdd } from 'react-icons/io5'
import { MdPlaylistAddCheckCircle as CheckIcon, MdError } from "react-icons/md";
import { Input, Button, Drawer, Skeleton, Textarea, Snackbar } from '@mui/joy'
import { AllEndpointResponse } from '@/types/global'
import useFetch from '@/helpers/useFetch'
import Menu from './menu'
import { useEffect, useState } from 'react'

export default function SidebarLayout() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [toast, setToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'danger'>('success')
  const [endpoints, setEndpoints] = useState<AllEndpointResponse>([])
  const [isEndpointsLoaded, setIsEndpointsLoaded] = useState(false)
  const [uniqueNameError, setUniqueNameError] = useState(false)
  const getEndpoints = useFetch<AllEndpointResponse>(`${process.env.NEXT_PUBLIC_API_URL}/master`)
  const postEndpoint = useFetch<AllEndpointResponse>(`${process.env.NEXT_PUBLIC_API_URL}/master`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  })

  useEffect(() => {
    init()
  }, [])

  const init = async() => {
    setIsEndpointsLoaded(false)
    const { data } = await getEndpoints()
    if (data) setEndpoints(data)
    setIsEndpointsLoaded(true)
  }

  const closeDrawer = () => {
    setName('')
    setDescription('')
    setOpenDrawer(false)
    setUniqueNameError(false)
  }

  const renderMenu = () => {
    if (!endpoints.length && !isEndpointsLoaded) return Array.from({ length: 5 }).map((_, index) => (
      <div className="w-full mt-4 h-[36px] rounded-lg relative" key={index}>
        <Skeleton loading animation="wave"/>
      </div>
    ))
    return endpoints?.map((endpoint, index) => <Menu {...endpoint} key={'menu-' + index} />)
  }

  const saveEndpoint = async () => {
    setUniqueNameError(false)
    const { error } = await postEndpoint()
    if (error) {
      setToastType('danger')
      if (error.statusCode === 400) setUniqueNameError(true)
    } else {
      closeDrawer()
      setToastType('success')
      init()
    }
    setToast(true)
  }

  return (
    <>
      <div id="sidebar" className="flex flex-col justify-between pb-9 relative w-[360px] px-4">
        <div>
          <div className='relative w-[150px] h-[80px] icon'>
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
            onClick={() => setOpenDrawer(true)}
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

      <Drawer anchor='right' open={openDrawer} variant='soft' onClose={closeDrawer}>
        <div className="p-8">
          <p className="text-2xl">Create New Endpoint { uniqueNameError }</p>
          <div className="mt-9">
            <p className="text-md text-medium">Name</p>
            <Input
              placeholder="Enter Endpoint name"
              variant="outlined"
              value={name}
              color={uniqueNameError ? 'danger' : 'neutral'}
              size='md'
              className='mt-2'
              onChange={(e) => e.target.value.length <= 25 && setName(e.target.value)}
              fullWidth
            />
            <div className="flex justify-between mt-2 mx-2">
              <p className={`text-xs error ${uniqueNameError ? '' : 'invisible'}`}>This name is taken.</p>
              <p className="text-xs">{name.length}/25</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-md text-medium">Description</p>
            <Textarea
              placeholder="Enter Endpoint description"
              variant="outlined"
              value={description}
              size='md'
              minRows={5}
              className='mt-2'
              onChange={(e) => e.target.value.length <= 250 && setDescription(e.target.value)}
            />
            <div className="flex flex-row-reverse mt-2 mr-2">
              <p className="text-xs">{description.length}/250</p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              color="neutral"
              loadingPosition='end'
              onClick={saveEndpoint}
              variant="solid"
              disabled={!name}
              className='w-full primary'
            >
              Save
            </Button>
          </div>
          <div className="mt-4">
            <Button
              color="neutral"
              loadingPosition='end'
              onClick={closeDrawer}
              variant="solid"
              className='w-full secondary'
            >
              Cancel
            </Button>
          </div>

        </div>
      </Drawer>

      <Snackbar
        variant="soft"
        color={toastType}
        open={toast}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        startDecorator={toastType === 'success' ? <CheckIcon color='green' size={24} /> : <MdError color='red' size={24} />}
        autoHideDuration={1500}
        endDecorator={
          <Button
            onClick={() => setToast(false)}
            size="sm"
            variant="soft"
            color={toastType}
          >
            Dismiss
          </Button>
        }
      >
        {toastType === 'success' ? 'Endpoint has been created.' : 'Failed to create Endpoint.'}
      </Snackbar>
    </>
  )
}