'use client';

import useFetch from "@/helpers/useFetch"
import { CallDetailType } from "@/types/global"
import { Button, Snackbar, SnackbarCloseReason, Textarea } from "@mui/joy";
import { MdPlaylistAddCheckCircle as CheckIcon, MdEdit } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { SiCurl } from "react-icons/si";
import { notFound, useParams, useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import CenterLayout from "../../components/center-layout";
import Loading from "../../components/loading";
import MethodBadge from "../../components/method";
import Editor from '@monaco-editor/react';

export default function CallDetailPage() {
  const { endpoint: endpointSlug, call: callSlug } = useParams()
  const [copyToast, setCopyToast] = useState(false)
  const [copyType, setCopyType] = useState<'URL' | 'cURL' | 'Response' | 'Error message'>('URL')
  const [call, setCall] = useState<CallDetailType>()
  const [isInvalidSlug, setIsInvalidSlug] = useState(false)
  const getCallDetail = useFetch<CallDetailType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${endpointSlug}/${callSlug}`)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setCall(undefined)
    const { data } = await getCallDetail()
    if (!data) setIsInvalidSlug(true)
    setCall(data)
  }

  if (isInvalidSlug) return notFound()
  if (!call) return (
    <CenterLayout>
      <Loading />
    </CenterLayout>
  )

  const copyAsUrl = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/api/${call.endpoint.slug}/${call.slug}`)
    setCopyType('URL')
    setCopyToast(true)
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(call.response ? JSON.stringify(call.response, null, 2) : '');
    setCopyType('Response')
    setCopyToast(true)
  }

  const copyError = () => {
    navigator.clipboard.writeText(call.error_message || '');
    setCopyType('Error message')
    setCopyToast(true)
  }

  const copyAsCurl = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${call.endpoint.slug}/${call.slug}`;
    const commandParts = ['curl', `-X ${call.method}`];
    if (call.method !== 'GET') {
      commandParts.push(`-H "Content-Type: application/json"`);
      commandParts.push(`-d '{}'`);
    }
    commandParts.push(`"${url}"`);
    navigator.clipboard.writeText(commandParts.join(' '));
    setCopyType('cURL')
    setCopyToast(true)
  }

  const closeSnackbar = (reason: SnackbarCloseReason, set: Dispatch<SetStateAction<boolean>>) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return
    set(false)
  }

  const renderErrorMessage = () => {
    if (!call.is_error) return;
    return (
      <div className="flex mt-3">
        <p className="text-[16px] w-fit min-w-[148px]">Message</p>
        <div>
          <Textarea
            variant="outlined"
            value={call.error_message}
            size='sm'
            className="w-[400px]"
            minRows={5}
            disabled
          />
          <Button className="primary !mt-4" size="sm" startDecorator={<FaCopy/>} onClick={copyError}>Copy error message</Button>
        </div>
      </div>
    )
  }

  const renderResponse = () => {
    if (call.is_error) return;
    return (
      <div className="flex mt-3">
        <p className="text-[16px] w-fit min-w-[148px]">Response</p>
        <div className="w-[60%]">
          <Editor
            height="420px"
            defaultLanguage="json"
            className="pr-4"
            value={call.response ? JSON.stringify(call.response, null, 2) : ''}
            theme="vs-dark"
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'auto',
              },
            }}
          />
          <Button className="primary !mt-4" size="sm" startDecorator={<FaCopy/>} onClick={copyResponse}>Copy response</Button>
        </div>
      </div>
    )
  }

  return <div>
    <div className="flex items-center justify-between">
      <MethodBadge type={call.method} fontSize="text-[32px]"/>
      <div className="flex-shrink-0">
        <Button className="!mr-2 secondary" startDecorator={<MdEdit />} onClick={() => {}}>Edit</Button>
      </div>
    </div>
    <div className="flex flex-col items-start justify-between mt-5">
      <p className="text-[18px] w-fit">{process.env.NEXT_PUBLIC_API_URL}/api/{call.endpoint.slug}/{call.slug}</p>
      <div className="flex mt-3">
        <Button className="!mr-2 primary" size="sm" startDecorator={<SiCurl/>} onClick={copyAsCurl}>Copy as cURL</Button>
        <Button className="primary" size="sm" startDecorator={<FaCopy/>} onClick={copyAsUrl}>Copy as URL</Button>
      </div>
    </div>

    <div className="flex items-center mt-10">
      <p className="text-[16px] w-fit min-w-[148px]">Status Code</p>
      <p className="font-bold text-[14px]">{call.response_code}</p>
    </div>


    <div className="flex items-center mt-3">
      <p className="text-[16px] w-fit min-w-[148px]">Status</p>
      <div className={`mt-1 badge ${call.is_error ? 'bg-[var(--method-delete)]' : 'bg-[var(--method-get)]'} text-[var(--background)] text-[14px] rounded-lg w-fit px-2 py-1`}>
        {call.is_error ? 'error' : 'success'}
      </div>
    </div>

    { renderErrorMessage() }

    { renderResponse() }

    <Snackbar
      variant="soft"
      color='success'
      open={copyToast}
      onClose={(_, reason) => closeSnackbar(reason, setCopyToast)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<CheckIcon color='green' size={24} />}
      autoHideDuration={1500}
      endDecorator={
        <Button
          onClick={() => setCopyToast(false)}
          size="sm"
          variant="soft"
          color='success'
        >
          Dismiss
        </Button>
      }
    >
      {copyType} has been copied to clipboard.
    </Snackbar>
  </div>
}