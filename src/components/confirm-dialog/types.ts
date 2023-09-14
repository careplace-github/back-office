import { DialogProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps extends Omit<Omit<DialogProps, 'title'>, 'content'> {
  title: string;
  content?: string | React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}
