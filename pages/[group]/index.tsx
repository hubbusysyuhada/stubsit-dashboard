'use client';

import useFetch from "@/helpers/useFetch"
import { GroupDetailType } from "@/types/global"
import { Button, Card, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Snackbar, SnackbarCloseReason, Tooltip } from "@mui/joy";
import { MdPlaylistAddCheckCircle as CheckIcon, MdEdit, MdOutlineDelete, MdError } from "react-icons/md";
import { PiBracketsCurlyDuotone as APIIcon } from "react-icons/pi";
import { notFound } from "next/navigation"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import useNavigation from "@/store/useNavigation";
import CenterLayout from "@/components/center-layout";
import Loading from "@/components/loading";
import EditGroupDrawer from "@/components/editGroupDrawer";

export default function GroupDetailPage() {
  const router = useRouter()
  const { group: slug } = router.query
  const { fetchGroups } = useNavigation()
  const [deleteToast, setDeleteToast] = useState(false)
  const [disableDeleteModalBtn, setDisableDeleteModalBtn] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [errorDelete, setErrorDelete] = useState(false)
  const [group, setGroup] = useState<GroupDetailType>()
  const [isInvalidSlug, setIsInvalidSlug] = useState(false)
  const [openEditDrawer, setOpenEditDrawer] = useState(false)

  const getEndpointDetail = useFetch<GroupDetailType>(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`)
  const deleteEndpoint = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/master/${slug}`, { method: "DELETE" })

  const init = useCallback(async () => {
    if (slug) {
      setGroup(undefined)
      const { data } = await getEndpointDetail()
      if (!data) setIsInvalidSlug(true)
      setGroup(data)
    }
  }, [getEndpointDetail, router])

  useEffect(() => {
    init()
  }, [init])

  const deleteConfirmed = async () => {
    setDisableDeleteModalBtn(true)
    const { error } = await deleteEndpoint()
    if (!error) {
      setDeleteToast(true)
      router.push('/')
      await fetchGroups()
    }
    else {
      setOpenDeleteModal(false)
      setErrorDelete(true)
      setDisableDeleteModalBtn(false)
    }
  }

  if (isInvalidSlug) return notFound()
  if (!group) return (
    <CenterLayout>
      <Loading />
    </CenterLayout>
  )

  const goToEndpoint = (endpointSlug: string) => {
    router.push(`/${slug}/${endpointSlug}`)
  }

  const renderEndpoints = () => {
    return group.endpoints.map((endpoint, i) => 
      <Card variant="plain" className="mt-4" key={i}>
        <div className="flex flex-row">
          <div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <APIIcon className="mr-2 text-[20px]"/>
              <p className="text-[16px] font-bold">{endpoint.name}</p>
            </div>
            <p className="text-[12px] mt-2">{endpoint.description}</p>
            <Button
              color="neutral"
              onClick={() => goToEndpoint(endpoint.slug)}
              variant="solid"
              className='!mt-4 secondary w-[80px]'
            >
              View
            </Button>
          </div>
        </div>
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
        <p className="text-[32px] font-bold">{ group.name }</p>
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

      <p className="mt-4">{ group.description }</p>

      <div className="call-container mt-5">
        { renderEndpoints() }
      </div>
    </div>

    <Modal open={openDeleteModal} onClose={closeModal}>
      <ModalDialog variant="outlined" className="!w-[400px] items-center">
        <DialogTitle className="foobar">Confirm Delete Group</DialogTitle>
        <DialogContent>
          <div className="mt-2">
            <p className="m-0 text-center text-sm">Are you sure you want to delete this Group? This action cannot be undone, and all associated data will be permanently removed.</p>
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
      Group has been deleted.
    </Snackbar>

    <Snackbar
      variant="soft"
      color='danger'
      open={errorDelete}
      onClose={(_, reason) => closeSnackbar(reason, setErrorDelete)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={<MdError color='red' size={24} />}
      autoHideDuration={1500}
      endDecorator={
        <Button
          onClick={() => setErrorDelete(false)}
          size="sm"
          variant="soft"
          color='danger'
        >
          Dismiss
        </Button>
      }
    >
      Failed to delete Group.
    </Snackbar>

    <EditGroupDrawer open={openEditDrawer} onClose={() => setOpenEditDrawer(false)} group={group} onSave={init}/>
  </>
}