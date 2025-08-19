'use client';

import useFetch from "@/helpers/useFetch"
import { BaseEndpointType } from "@/types/global"
import { Button, DialogContent, DialogTitle, Modal, ModalDialog, Skeleton, Snackbar } from "@mui/joy";
import { MdPlaylistAddCheckCircle as CheckIcon } from "react-icons/md";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EndpointDetailPage() {
  const router = useRouter()
  const { endpoint: slug } = useParams()
  const [deleteToast, setDeleteToast] = useState(false)
  const [disableDeleteModalBtn, setDisableDeleteModalBtn] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [endpoint, setEndpoint] = useState<BaseEndpointType>()
  const getEndpointDetail = useFetch<BaseEndpointType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`)
  const deleteEndpoint = useFetch<BaseEndpointType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`, { method: "DELETE" })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await getEndpointDetail()
    setEndpoint(data)
  }

  const deleteConfirmed = async () => {
    setDisableDeleteModalBtn(true)
    await deleteEndpoint()
    router.push('/')
    setDeleteToast(true)
  }

  return <>
    <div className="flex items-center justify-between">
      { endpoint ? <p className="text-[32px] font-bold">{ endpoint.name }</p> : <Skeleton animation="wave" variant="text" level="h1" className="!w-[50%]" /> }
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

    <div className="mt-4">
      {/* <p className="text-[14px] text-gray-600">{ endpoint.description }</p> */}
    </div>



    <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <ModalDialog variant="outlined" className="!w-[400px]">
        <DialogTitle className="foobar">Confirm Delete Endpoint</DialogTitle>
        <DialogContent>
          <div>
            <p className="m-0">Are you sure you want to delete this API? This action cannot be undone, and all associated data will be permanently removed.</p>
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