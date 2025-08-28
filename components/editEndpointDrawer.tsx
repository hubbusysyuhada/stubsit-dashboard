'use client';

import useFetch from '@/helpers/useFetch';
import useNavigation from '@/store/useNavigation';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, Button, Drawer, Textarea, SnackbarCloseReason, Select, Option } from '@mui/joy';
import { EndpointDetailType } from '@/types/global';
import useToast from '@/store/useToast';

type EditEndpointDrawerPropsType = {
  onClose: () => void;
  open: boolean;
  endpoint: EndpointDetailType;
  onSave: () => void;
};

export default function EditEndpointDrawer(payload: EditEndpointDrawerPropsType) {
  const router = useRouter();
  const { fetchGroups, groups } = useNavigation();
  const { addToast } = useToast();
  const maxLength = 2000;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [uniqueNameError, setUniqueNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const { group } = useParams();

  useEffect(() => setSelectedGroup((group as string) || ''), [group]);

  useEffect(() => {
    if (payload.open) setOpenDrawer(true);
  }, [payload.open]);
  useEffect(() => {
    setName(payload.endpoint.name);
    setDescription(payload.endpoint.description);
  }, [payload.endpoint]);

  const updateEndpoint = useFetch<string>(
    `${process.env.NEXT_PUBLIC_API_URL}/master/${group}/${payload.endpoint.slug}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, group: selectedGroup }),
    }
  );

  const closeDrawer = (reason?: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    setName(payload.endpoint.name);
    setDescription(payload.endpoint.description);
    setSelectedGroup((group as string) || '');
    setOpenDrawer(false);
    setUniqueNameError(false);
    payload.onClose();
  };

  const saveEndpoint = async () => {
    setUniqueNameError(false);
    setIsLoading(true);
    const { error, data } = await updateEndpoint();
    if (error) {
      if (error.statusCode === 400) setUniqueNameError(true);
    } else {
      closeDrawer();
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchGroups();
      if (data) router.push(`/${selectedGroup}/${payload.endpoint.slug}`);
      payload.onSave();
    }
    setIsLoading(false);
    addToast({
      id: 'edit-endpoint-toast',
      text: error ? 'Failed to edit Endpoint.' : 'Endpoint has been edited.',
      variant: error ? 'danger' : 'success',
    });
  };

  const closeSnackbar = (
    _: React.SyntheticEvent<unknown> | Event | null,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return;
  };

  const renderOptions = () => {
    if (!groups.length) return <></>;
    return groups.map((group) => (
      <Option value={group.slug} key={group.slug}>
        {group.name}
      </Option>
    ));
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={openDrawer}
        variant="soft"
        onClose={(_, reason) => closeDrawer(reason)}
      >
        <div className="p-8">
          <p className="text-2xl">Edit Endpoint Details</p>
          <div className="mt-9">
            <p className="text-md text-medium">Name</p>
            <Input
              placeholder="Enter Endpoint name"
              variant="outlined"
              value={name}
              color={uniqueNameError ? 'danger' : 'neutral'}
              size="md"
              className="mt-2"
              onChange={(e) => e.target.value.length <= 25 && setName(e.target.value)}
              fullWidth
            />
            <div className="flex justify-between mt-2 mx-2">
              <p className={`text-xs error ${uniqueNameError ? '' : 'invisible'}`}>
                This name is taken.
              </p>
              <p className="text-xs">{name.length}/25</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-md text-medium">Description</p>
            <Textarea
              placeholder="Enter Endpoint description"
              variant="outlined"
              value={description}
              size="md"
              minRows={5}
              className="mt-2"
              onChange={(e) => e.target.value.length <= maxLength && setDescription(e.target.value)}
            />
            <div className="flex flex-row-reverse mt-2 mr-2">
              <p className="text-xs">
                {description.length}/{maxLength}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-md text-medium">Group</p>
            <Select
              value={selectedGroup}
              className="mt-2"
              onChange={(_, val) => setSelectedGroup(val || '')}
            >
              {renderOptions()}
            </Select>
          </div>

          <div className="mt-4">
            <Button
              color="neutral"
              loadingPosition="end"
              onClick={saveEndpoint}
              variant="solid"
              disabled={!name || isLoading}
              className="w-full primary"
            >
              Save
            </Button>
          </div>
          <div className="mt-4">
            <Button
              color="neutral"
              loadingPosition="end"
              onClick={() => closeDrawer()}
              variant="solid"
              disabled={isLoading}
              className="w-full secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
