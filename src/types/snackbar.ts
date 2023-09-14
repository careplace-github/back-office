export type ISnackbarProps = {
  show: boolean;
  severity: 'success' | 'error' | 'info' | 'warning';
  message: string;
};
