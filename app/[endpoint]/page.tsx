'use client';

import useFetch from "@/helpers/useFetch"
import { EndpointDetailType, MethodType } from "@/types/global"
import { Button, Card, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Snackbar, SnackbarCloseReason, Tooltip } from "@mui/joy";
import { MdPlaylistAddCheckCircle as CheckIcon, MdEdit, MdOutlineDelete } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { SiCurl } from "react-icons/si";
import { notFound, useParams, useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import useNavigation from "@/store/useNavigation";
import CenterLayout from "../components/center-layout";
import Loading from "../components/loading";
import MethodBadge from "../components/method";
import EditEndpointDrawer from "../components/editEndpointDrawer";

export default function EndpointDetailPage() {
  const router = useRouter()
  const { endpoint: slug } = useParams()
  const { fetchEndpoints } = useNavigation()
  const [deleteToast, setDeleteToast] = useState(false)
  const [copyToast, setCopyToast] = useState(false)
  const [urlType, setUrlType] = useState<'URL' | 'cURL'>('URL')
  const [disableDeleteModalBtn, setDisableDeleteModalBtn] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [endpoint, setEndpoint] = useState<EndpointDetailType>()
  const [isInvalidSlug, setIsInvalidSlug] = useState(false)
  const [openEditDrawer, setOpenEditDrawer] = useState(false)
  const getEndpointDetail = useFetch<EndpointDetailType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`)
  const deleteEndpoint = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`, { method: "DELETE" })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setEndpoint(undefined)
    const { data } = await getEndpointDetail()
    if (!data) setIsInvalidSlug(true)
    setEndpoint(data)
  }

  const deleteConfirmed = async () => {
    setDisableDeleteModalBtn(true)
    await deleteEndpoint()
    router.push('/')
    setDeleteToast(true)
    await fetchEndpoints()
  }

  if (isInvalidSlug) return notFound()
  if (!endpoint) return (
    <CenterLayout>
      <Loading />
    </CenterLayout>
  )

  const copyAsUrl = (callSlug: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint.slug}/${callSlug}`)
    setUrlType('URL')
    setCopyToast(true)
  }

  const copyAsCurl = (callSlug: string, method: MethodType) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint.slug}/${callSlug}`;
    const commandParts = ['curl', `-X ${method}`];
    if (method !== 'GET') {
      commandParts.push(`-H "Content-Type: application/json"`);
      commandParts.push(`-d '{}'`);
    }
    commandParts.push(`"${url}"`);
    navigator.clipboard.writeText(commandParts.join(' '));
    setUrlType('cURL')
    setCopyToast(true)
  }

  const goToCallDetails = (callSlug: string) => {
    router.push(`/${endpoint.slug}/${callSlug}`)
  }

  const renderCalls = () => {
    return endpoint.calls.map((call, i) => 
      <Card variant="plain" className="mt-4" key={i}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MethodBadge type={call.method} fontSize="text-[16px]" minWidth="min-w-[80px]"/>
            <p className="m-0 truncate flex-1">{process.env.NEXT_PUBLIC_API_URL}/api/{endpoint.slug}/{call.slug}</p>
          </div>
          <div className="flex-shrink-0">
            <IconButton variant="soft" size="sm" className="secondary !mr-2" onClick={() => copyAsCurl(call.slug, call.method)}>
              <Tooltip title="Copy as cURL" placement="bottom" variant="solid">
                <SiCurl size='14'/>
              </Tooltip>
            </IconButton>
            <IconButton variant="soft" size="sm" className="secondary" onClick={() => copyAsUrl(call.slug)}>
              <Tooltip title="Copy as URL" placement="bottom" variant="solid">
                <FaCopy size='14'/>
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`mt-1 badge ${call.is_error ? 'bg-[var(--method-delete)]' : 'bg-[var(--method-get)]'} text-[var(--background)] text-[12px] rounded-lg w-fit px-2 py-1`}>
            {call.is_error ? 'error' : 'success'}
          </div>
          <p className="ml-3 font-bold">{call.response_code}</p>
        </div>
        <Button
          color="neutral"
          onClick={() => goToCallDetails(call.slug)}
          variant="solid"
          className='mt-2 secondary w-[80px]'
        >
          View
        </Button>
      </Card>
    )
  }

  const closeSnackbar = (reason: SnackbarCloseReason, set: Dispatch<SetStateAction<boolean>>) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return
    set(false)
  }

  const closeModal = () => {
    if (!disableDeleteModalBtn) setOpenDeleteModal(false)
  }

  return <>
    <div className="page-content">
      <div className="flex items-center justify-between">
        <p className="text-[32px] font-bold">{ endpoint.name }</p>
        <div className="flex">
          <Button
            color="neutral"
            size="sm"
            onClick={() => setOpenEditDrawer(true)}
            startDecorator={<MdEdit />}
            variant="solid"
            className='w-[84px] h-[40px] secondary !mr-4'
          >
            Edit
          </Button>
          <Button
            color="neutral"
            size="sm"
            onClick={() => setOpenDeleteModal(true)}
            startDecorator={<MdOutlineDelete />}
            variant="solid"
            className='w-[84px] h-[40px] secondary'
          >
            Delete
          </Button>
        </div>
      </div>

      <p className="mt-4">{ endpoint.description }</p>

      <div className="call-container mt-5">
        { renderCalls() }
      </div>
    </div>

    <Modal open={openDeleteModal} onClose={closeModal}>
      <ModalDialog variant="outlined" className="!w-[400px] items-center">
        <DialogTitle className="foobar">Confirm Delete Endpoint</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <p className="m-0 text-center text-sm">Are you sure you want to delete this API? This action cannot be undone, and all associated data will be permanently removed.</p>
            <Button
              color="neutral"
              loadingPosition='end'
              onClick={deleteConfirmed}
              disabled={disableDeleteModalBtn}
              variant="solid"
              className='w-full primary !mt-4'
            >
              Delete
            </Button>
            <Button
              color="neutral"
              loadingPosition='end'
              onClick={() => setOpenDeleteModal(false)}
              disabled={disableDeleteModalBtn}
              variant="solid"
              className='w-full secondary !mt-4'
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </ModalDialog>
      
    </Modal>
  
    <Snackbar
      variant="soft"
      color='success'
      open={deleteToast}
      onClose={(_, reason) => closeSnackbar(reason, setDeleteToast)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<CheckIcon color='green' size={24} />}
      autoHideDuration={1500}
      endDecorator={
        <Button
          onClick={() => setDeleteToast(false)}
          size="sm"
          variant="soft"
          color='success'
        >
          Dismiss
        </Button>
      }
    >
      Endpoint has been deleted.
    </Snackbar>

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
      {urlType} has been copied to clipboard.
    </Snackbar>

    <EditEndpointDrawer open={openEditDrawer} onClose={() => setOpenEditDrawer(false)} endpoint={endpoint} onSave={init}/>
  </>
}