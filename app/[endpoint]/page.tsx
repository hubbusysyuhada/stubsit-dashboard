'use client';

import useFetch from "@/helpers/useFetch"
import { BaseEndpointType } from "@/types/global"
import { Button, DialogContent, DialogTitle, Modal, ModalDialog, Skeleton, Snackbar } from "@mui/joy";
import { MdPlaylistAddCheckCircle as CheckIcon } from "react-icons/md";
import { notFound, useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useNavigation from "@/store/useNavigation";
import CenterLayout from "../components/center-layout";
import Loading from "../components/loading";

export default function EndpointDetailPage() {
  const router = useRouter()
  const { endpoint: slug } = useParams()
  const { fetchEndpoints } = useNavigation()
  const [deleteToast, setDeleteToast] = useState(false)
  const [disableDeleteModalBtn, setDisableDeleteModalBtn] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [endpoint, setEndpoint] = useState<BaseEndpointType>()
  const [isInvalidSlug, setIsInvalidSlug] = useState(false)
  const getEndpointDetail = useFetch<BaseEndpointType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`)
  const deleteEndpoint = useFetch<BaseEndpointType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`, { method: "DELETE" })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
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

  return <>
    <div className="page-content">
      <div className="flex items-center justify-between">
        <p className="text-[32px] font-bold">{ endpoint.name }</p>
        <div className="flex">
          <Button
            color="neutral"
            loadingPosition='end'
            onClick={() => {}}
            variant="solid"
            className='w-[84px] h-[40px] secondary !mr-4'
          >
            Edit
          </Button>
          <Button
            color="neutral"
            loadingPosition='end'
            onClick={() => setOpenDeleteModal(true)}
            variant="solid"
            className='w-[84px] h-[40px] secondary'
          >
            Delete
          </Button>
        </div>
      </div>
    </div>

    <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
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
      onClose={() => setDeleteToast(false)}
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
  </>
}