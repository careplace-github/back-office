/* eslint-disable react/no-danger */
import { useResponsive } from 'src/hooks/use-responsive';
import { useTheme } from '@emotion/react';
import { Box, Modal, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../iconify/Iconify';

type props = {
  open: boolean;
  onClose: () => void;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  isSubmitting: boolean;
  color?: 'error' | 'primary';
  icon?: string;
  iconColor?: string;
};

const PromptPopup = ({
  open,
  onClose,
  onConfirm,
  color = 'error',
  text,
  confirmText,
  cancelText,
  isSubmitting,
  iconColor = '#FF5630',
  icon = 'carbon:warning-filled',
}: props) => {
  const isMdUp = useResponsive('up', 'md');
  const theme = useTheme();
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}>
      <Box
        sx={{
          width: isMdUp ? 'auto' : '100vw',
          height: isMdUp ? 'auto' : '100vh',
          minWidth: isMdUp ? '500px' : undefined,
          maxHeight: isMdUp ? '90vh' : '100vh',
          p: isMdUp ? '50px' : '20px',
          pt: isMdUp ? '50px' : '75px',
          pb: isMdUp ? '50px' : '75px',
          backgroundColor: 'white',
          borderRadius: isMdUp ? '16px' : '0',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateY(-50%) translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflowY: 'auto',
        }}>
        <Iconify
          width={30}
          height={30}
          icon="material-symbols:close-rounded"
          sx={{
            position: 'absolute',
            right: isMdUp ? '50px' : '20px',
            cursor: 'pointer',
            '&:hover': {
              cursor: 'pointer',
              color: 'grey.400',
            },
          }}
          onClick={() => {
            onClose();
          }}
        />

        <Iconify icon={icon} width={50} height={50} sx={{ color: iconColor }} />

        <Typography
          variant="body2"
          sx={{ mt: 5, mb: 2, color: 'text.secondary', textAlign: 'center' }}>
          {text}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 2,
            width: '100%',
            gap: '10px',
          }}>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ width: '100%' }}
            onClick={() => {
              onClose();
            }}>
            {cancelText}
          </Button>

          <LoadingButton
            variant="contained"
            color={color}
            loading={isSubmitting}
            sx={{ width: '100%' }}
            onClick={async () => {
              await onConfirm();
            }}>
            {confirmText}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default PromptPopup;
