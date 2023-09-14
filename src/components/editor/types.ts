import { ReactQuillProps } from 'react-quill';
// @mui
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface EditorProps extends ReactQuillProps {
  id?: string;
  error?: boolean;
  value?: string;
  onChange?: (content: string, delta: any, source: any, editor: any) => void;
  simple?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme>;
}
