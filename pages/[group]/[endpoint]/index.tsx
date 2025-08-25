'use client';

import useFetch from '@/helpers/useFetch';
import { EndpointDetailType, MethodType } from '@/types/global';
import {
  Button,
  Card,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  ModalDialog,
  SnackbarCloseReason,
  Tooltip,
} from '@mui/joy';
import { MdEdit, MdOutlineDelete } from 'react-icons/md';
import { FaCopy } from 'react-icons/fa';
import { SiCurl } from 'react-icons/si';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import useNavigation from '@/store/useNavigation';
import CenterLayout from '@/components/center-layout';
import Loading from '@/components/loading';
import MethodBadge from '@/components/method';
import EditEndpointDrawer from '@/components/editEndpointDrawer';
import useToast from '@/store/useToast';

export default function EndpointDetailPage() {
  const router = useRouter();
  const { endpoint: slug, group: groupSlug } = router.query;
  const { fetchGroups } = useNavigation();
  const { addToast } = useToast();
  const [disableDeleteModalBtn, setDisableDeleteModalBtn] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [endpoint, setEndpoint] = useState<EndpointDetailType>();
  const [isInvalidSlug, setIsInvalidSlug] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const getEndpointDetail = useFetch<EndpointDetailType>(
    `${process.env.NEXT_PUBLIC_API_URL}/master/${groupSlug}/${slug}`
  );
  const deleteEndpoint = useFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/master/${groupSlug}/${slug}`,
    { method: 'DELETE' }
  );

  const init = useCallback(async () => {
    if (slug && groupSlug) {
      setEndpoint(undefined);
      const { data } = await getEndpointDetail();
      if (!data) setIsInvalidSlug(true);
      setEndpoint(data);
    }
  }, [getEndpointDetail, router]);

  useEffect(() => {
    init();
  }, [init]);

  const deleteConfirmed = async () => {
    setDisableDeleteModalBtn(true);
    await deleteEndpoint();
    addToast({
      id: 'delete-endpoint-toast',
      variant: 'success',
      text: 'Endpoint has been deleted.',
    });
    router.push(`/${groupSlug}`);
    await fetchGroups();
  };

  if (isInvalidSlug) return notFound();
  if (!endpoint)
    return (
      <CenterLayout>
        <Loading />
      </CenterLayout>
    );

  const copyAsUrl = (callSlug: string) => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint.slug}/${callSlug}`
    );
    addToast({
      id: 'copy-endpoint-url-toast',
      variant: 'success',
      text: 'URL has been copied to clipboard.',
    });
  };

  const copyAsCurl = (callSlug: string, method: MethodType) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint.slug}/${callSlug}`;
    const commandParts = ['curl', `-X ${method}`];
    if (method !== 'GET') {
      commandParts.push(`-H "Content-Type: application/json"`);
      commandParts.push(`-d '{}'`);
    }
    commandParts.push(`"${url}"`);
    navigator.clipboard.writeText(commandParts.join(' '));
    addToast({
      id: 'copy-endpoint-url-toast',
      variant: 'success',
      text: 'cURL has been copied to clipboard.',
    });
  };

  const goToCallDetails = (callSlug: string) => {
    router.push(`/${groupSlug}/${endpoint.slug}/${callSlug}`);
  };

  const renderCalls = () => {
    return endpoint.calls.map((call, i) => (
      <Card variant="plain" className="mt-4 !text-[var(--foreground)]" key={i}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MethodBadge type={call.method} fontSize="text-[16px]" minWidth="min-w-[80px]" />
            <p className="m-0 truncate flex-1">
              {process.env.NEXT_PUBLIC_API_URL}/api/{endpoint.slug}/{call.slug}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Tooltip title="Copy as cURL" placement="bottom" variant="solid">
              <IconButton
                variant="soft"
                size="sm"
                className="secondary !mr-2"
                onClick={() => copyAsCurl(call.slug, call.method)}
              >
                <SiCurl size="14" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy as URL" placement="bottom" variant="solid">
              <IconButton
                variant="soft"
                size="sm"
                className="secondary"
                onClick={() => copyAsUrl(call.slug)}
              >
                <FaCopy size="14" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center">
          <div
            className={`mt-1 badge ${call.is_error ? 'bg-[var(--method-delete)]' : 'bg-[var(--method-get)]'} text-[var(--background)] text-[12px] rounded-lg w-fit px-2 py-1`}
          >
            {call.is_error ? 'error' : 'success'}
          </div>
          <p className="ml-3 font-bold">{call.response_code}</p>
        </div>
        <Button
          color="neutral"
          onClick={() => goToCallDetails(call.slug)}
          variant="solid"
          className="mt-2 secondary w-[80px]"
        >
          View
        </Button>
      </Card>
    ));
  };

  const closeSnackbar = (reason: SnackbarCloseReason, set: Dispatch<SetStateAction<boolean>>) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return;
    set(false);
  };

  const closeModal = () => {
    if (!disableDeleteModalBtn) setOpenDeleteModal(false);
  };

  return (
    <>
      <div className="page-content">
        <div className="flex items-center justify-between">
          <p className="text-[32px] font-bold">{endpoint.name}</p>
          <div className="flex">
            <Button
              color="neutral"
              size="sm"
              onClick={() => setOpenEditDrawer(true)}
              startDecorator={<MdEdit />}
              variant="solid"
              className="w-[84px] h-[40px] secondary !mr-4"
            >
              Edit
            </Button>
            <Button
              color="neutral"
              size="sm"
              onClick={() => setOpenDeleteModal(true)}
              startDecorator={<MdOutlineDelete />}
              variant="solid"
              className="w-[84px] h-[40px] secondary"
            >
              Delete
            </Button>
          </div>
        </div>

        <p className="mt-4">{endpoint.description}</p>

        <div className="call-container mt-5">{renderCalls()}</div>
      </div>

      <Modal open={openDeleteModal} onClose={closeModal}>
        <ModalDialog variant="outlined" className="!w-[400px] items-center">
          <DialogTitle className="foobar">Confirm Delete Endpoint</DialogTitle>
          <DialogContent>
            <div className="mt-2">
              <p className="m-0 text-center text-sm">
                Are you sure you want to delete this Endpoint? This action cannot be undone, and all
                associated data will be permanently removed.
              </p>
              <Button
                color="neutral"
                loadingPosition="end"
                onClick={deleteConfirmed}
                disabled={disableDeleteModalBtn}
                variant="solid"
                className="w-full primary !mt-4"
              >
                Delete
              </Button>
              <Button
                color="neutral"
                loadingPosition="end"
                onClick={() => setOpenDeleteModal(false)}
                disabled={disableDeleteModalBtn}
                variant="solid"
                className="w-full secondary !mt-4"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>

      <EditEndpointDrawer
        open={openEditDrawer}
        onClose={() => setOpenEditDrawer(false)}
        endpoint={endpoint}
        onSave={init}
      />
    </>
  );
}
