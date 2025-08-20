'use client';

import useFetch from "@/helpers/useFetch";
import useNavigation from "@/store/useNavigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input, Button, Drawer, Textarea, Snackbar, SnackbarCloseReason, Switch } from '@mui/joy'
import { MdPlaylistAddCheckCircle as CheckIcon, MdError } from "react-icons/md";
import { CallDetailType } from "@/types/global";
import MethodBadge from "./method";
import { Editor } from "@monaco-editor/react";

type EditCallDrawerPropsType = { onClose: () => void; open: boolean; call: CallDetailType; onSave: () => void }

export default function EditCallDrawer(payload: EditCallDrawerPropsType) {
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'danger'>('success')
  const [isLoading, setIsLoading] = useState(false)
  const [response_code, setResponseCode] = useState<number>(200)
  const [is_error, setIsError] = useState(false)
  const [error_message, setErrorMessage] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [isResponseValidJSON, setIsResponseValidJSON] = useState<boolean>(true)
  const { fetchEndpoints } = useNavigation()

  useEffect(() => {
    if (payload.open) setOpenDrawer(true)
  }, [payload.open])

  const disableSaveBtn = useMemo(() => {
    if (isLoading || !response_code || (!is_error && !isResponseValidJSON)) return true
    return false
  }, [isResponseValidJSON, is_error, response_code, isLoading])

  useEffect(() => {
    setResponseCode(payload.call.response_code)
    setIsError(payload.call.is_error)
    setErrorMessage(payload.call.error_message)
    if (payload.call.response) setResponse(JSON.stringify(payload.call.response, null, 2))
  }, [payload.call])

  const updateCall = useFetch<string>(`${process.env.NEXT_PUBLIC_API_URL}/master/${payload.call.endpoint.slug}/${payload.call.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      method: payload.call.method,
      response_code,
      is_error,
      error_message: is_error ? error_message : null,
      response: !is_error && response ? JSON.parse(response) : null,
    }),
  })

  const closeDrawer = (reason?: "backdropClick" | "escapeKeyDown" | "closeClick") => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    setResponseCode(payload.call.response_code)
    setIsError(payload.call.is_error)
    setErrorMessage(payload.call.error_message)
    setResponse(payload.call.response ? JSON.stringify(payload.call.response) : null)
    setOpenDrawer(false)
    payload.onClose()
  }

  const saveCall = async () => {
    setIsLoading(true)
    const { error, data } = await updateCall()
    if (error) setToastType('danger')
    else {
      closeDrawer()
      setToastType('success')
      fetchEndpoints()
      if (data) router.push(`/${payload.call.endpoint.slug}/${payload.call.slug}`)
      payload.onSave()
      if (is_error) setResponse(null)
      else setErrorMessage(null)
    }
    setIsLoading(false)
    setToast(true)
  }

  const closeSnackbar = (_: React.SyntheticEvent<unknown> | Event | null, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return
    setToast(false)
  }

  const renderErrorMessageForm = () => {
    if (!is_error) return;
    return (
      <div className="mt-3">
        <p className="text-md text-medium">Message</p>
        <Textarea
          placeholder="Enter error message."
          variant="outlined"
          value={error_message || ''}
          size='md'
          minRows={5}
          className='mt-2'
          onChange={(e) => e.target.value.length <= 250 && setErrorMessage(e.target.value)}
        />
        <div className="flex flex-row-reverse mt-2 mr-2">
          <p className="text-xs">{error_message?.length || 0}/250</p>
        </div>
      </div>
    )
  }

  const renderResponseForm = () => {
    if (is_error) return;
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between pr-4">
          <p className="text-md text-medium">Response</p>
          <Button
            color="neutral"
            onClick={beautifyResponse}
            variant="solid"
            size="sm"
            className='secondary'
          >
            Beautify
          </Button>
        </div>
        <Editor
            height="420px"
            defaultLanguage="json"
            className="pr-4 mt-4"
            value={response || ''}
            theme="vs-dark"
            onChange={(value) => setResponse(value || null)}
            onValidate={(markers) => setIsResponseValidJSON(!markers.some(marker => marker.severity === 8))}
            options={{
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'auto',
              },
            }}
          />
      </div>
    )
  }

  const beautifyResponse = () => {
    if (isResponseValidJSON && response) {
      setResponse(JSON.stringify(JSON.parse(response), null, 2))
    }
  }

  return <>
    <Drawer anchor='right' open={openDrawer} variant='soft' onClose={(_, reason) => closeDrawer(reason)} size="md">
      <div className="p-8">
        <p className="text-2xl">Edit Call Details</p>
        <div className="mt-9 flex">
          <p className="text-md text-medium min-w-[100px]">Method</p>
          <MethodBadge type={payload.call.method} fontSize="text-[16px]"/>
        </div>
        <div className="mt-3 flex">
          <p className="text-md text-medium min-w-[100px]">Status</p>
          <Switch color={ !is_error ? 'success' : 'danger' } onChange={() => setIsError(!is_error)} variant="soft" />
          <div className={`${is_error ? 'bg-[var(--method-delete)]' : 'bg-[var(--method-get)]'} text-[var(--background)] text-[10px] rounded-lg w-fit px-2 py-1 ml-3`}>
            {is_error ? 'error' : 'success'}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <p className="text-md text-medium min-w-[100px]">Code</p>
          <Input
            placeholder="Enter status code."
            variant="outlined"
            value={response_code || ''}
            size='md'
            onChange={(e) => setResponseCode(+(e.target.value))}
          />
        </div>
        { renderErrorMessageForm() }
        { renderResponseForm() }

        <div className="mt-4">
          <Button
            color="neutral"
            loadingPosition='end'
            onClick={saveCall}
            variant="solid"
            disabled={disableSaveBtn}
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
      {toastType === 'success' ? 'Call has been edited.' : 'Failed to edit Call.'}
    </Snackbar>
  </>
}