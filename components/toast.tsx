import useToast from '@/store/useToast';
import { Button, Snackbar, SnackbarCloseReason } from '@mui/joy';
import { MdPlaylistAddCheckCircle as CheckIcon, MdError } from 'react-icons/md';

export default function toast() {
  const { removeToast, toast } = useToast();
  if (!toast) return <></>;
  const { id, isOpen, text, variant } = toast;

  const closeSnackbar = (reason: SnackbarCloseReason, id: string) => {
    if (reason === 'clickaway' || reason === 'escapeKeyDown') return;
    removeToast(id);
  };

  return (
    <div className="absolute bottom-0 right-0">
      <Snackbar
        key={id}
        open={isOpen}
        variant="soft"
        color={variant}
        onClose={(_, reason) => closeSnackbar(reason, id)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        startDecorator={
          variant === 'success' ? (
            <CheckIcon color="green" size={24} />
          ) : (
            <MdError color="red" size={24} />
          )
        }
        autoHideDuration={1500}
        endDecorator={
          <Button onClick={() => removeToast(id)} size="sm" variant="soft" color={variant}>
            Dismiss
          </Button>
        }
      >
        {text}
      </Snackbar>
    </div>
  );
}
