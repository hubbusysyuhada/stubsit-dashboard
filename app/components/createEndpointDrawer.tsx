'use client';

import useFetch from "@/helpers/useFetch";
import useNavigation from "@/store/useNavigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input, Button, Drawer, Textarea, Snackbar, SnackbarCloseReason } from '@mui/joy'
import { MdPlaylistAddCheckCircle as CheckIcon, MdError } from "react-icons/md";

type CreateEndpointDrawerPropsType = { onClose: () => void; open: boolean }

export default function CreateEndpointDrawer(payload: CreateEndpointDrawerPropsType) {
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'danger'>('success')
  const [uniqueNameError, setUniqueNameError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const {  fetchEndpoints } = useNavigation()

  useEffect(() => {
    if (payload.open) setOpenDrawer(true)
  }, [payload.open])

  const postEndpoint = useFetch<string>(`${process.env.NEXT_PUBLIC_API_URL}/master`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  })

  const closeDrawer = (reason?: "backdropClick" | "escapeKeyDown" | "closeClick") => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    setName('')
    setDescription('')
    setOpenDrawer(false)
    setUniqueNameError(false)
    payload.onClose()
  }

  const saveEndpoint = async () => {
    setUniqueNameError(false)
    setIsLoading(true)
    const { error, data } = await postEndpoint()
    if (error) {
      setToastType('danger')
      if (error.statusCode === 400) setUniqueNameError(true)
    } else {
      closeDrawer()
      setToastType('success')
      fetchEndpoints()
      if (data) router.push(`/${data}`)
    }
    setIsLoading(false)
    setToast(true)
  }

  const closeSnackbar = (_: React.SyntheticEvent<any> | Event | null, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return
    setToast(false)
  }

  return <>
    <Drawer anchor='right' open={openDrawer} variant='soft' onClose={(_, reason) => closeDrawer(reason)}>
      <div className="p-8">
        <p className="text-2xl">Create New Endpoint</p>
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
            disabled={!name || isLoading}
            className='w-full primary'
          >
            Save
          </Button>
        </div>
        <div className="mt-4">
          <Button
            color="neutral"
            loadingPosition='end'
            onClick={() => closeDrawer()}
            variant="solid"
            disabled={isLoading}
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
      onClose={closeSnackbar}
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
}