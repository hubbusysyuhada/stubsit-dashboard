'use client';

import useFetch from '@/helpers/useFetch';
import useNavigation from '@/store/useNavigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, Button, Drawer, Textarea, SnackbarCloseReason, Option } from '@mui/joy';
import { GroupDetailType } from '@/types/global';
import { useRouter } from 'next/router';
import useToast from '@/store/useToast';

type EditGroupDrawerPropsType = {
  onClose: () => void;
  open: boolean;
  group: GroupDetailType;
  onSave: () => void;
};

export default function EditGroupDrawer(payload: EditGroupDrawerPropsType) {
  const router = useRouter();
  const { addToast } = useToast();
  const maxLength = 500;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [uniqueNameError, setUniqueNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string>();
  const [name, setName] = useState('');
  const { group } = useParams();
  const { fetchGroups, groups } = useNavigation();

  useEffect(() => {
    if (payload.open) setOpenDrawer(true);
  }, [payload.open]);
  useEffect(() => {
    setName(payload.group.name);
    setDescription(payload.group.description);
  }, [payload.group]);

  const updateGroup = useFetch<string>(`${process.env.NEXT_PUBLIC_API_URL}/master/${group}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });

  const closeDrawer = (reason?: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    setName(payload.group.name);
    setDescription(payload.group.description);
    setOpenDrawer(false);
    setUniqueNameError(false);
    payload.onClose();
  };

  const saveGroup = async () => {
    setUniqueNameError(false);
    setIsLoading(true);
    const { error, data } = await updateGroup();
    if (error) {
      if (error.statusCode === 400) setUniqueNameError(true);
    } else {
      closeDrawer();
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchGroups();
      if (data) router.push(`/${group}`);
      payload.onSave();
    }
    setIsLoading(false);
    addToast({
      id: 'edit-group-toast',
      text: error ? 'Failed to edit Group.' : 'Group has been edited.',
      variant: error ? 'danger' : 'success',
    });
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
          <p className="text-2xl">Edit Group Details</p>
          <div className="mt-9">
            <p className="text-md text-medium">Name</p>
            <Input
              placeholder="Enter Group name"
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
              placeholder="Enter Group description"
              variant="outlined"
              value={description}
              size="md"
              minRows={5}
              className="mt-2"
              onChange={(e) => e.target.value.length <= maxLength && setDescription(e.target.value)}
            />
            <div className="flex flex-row-reverse mt-2 mr-2">
              <p className="text-xs">
                {description?.length || 0}/{maxLength}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              color="neutral"
              loadingPosition="end"
              onClick={saveGroup}
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
