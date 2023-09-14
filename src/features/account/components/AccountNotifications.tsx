// form
import { useForm } from 'react-hook-form';
// @mui
import { Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch } from 'src/components/hook-form';
import fetch from 'src/lib/fetch';
import { useSession } from 'next-auth/react';

// ----------------------------------------------------------------------

const ACTIVITY_OPTIONS = [
  {
    value: 'emailCommunication',
    label:
      'Aceito receber comunicação sobre futuras ofertas, promoções e novidades da plataforma, bem como sobre novos produtos e serviços, através do email.',
  },

  {
    value: 'phoneCommunication',
    label:
      'Aceito receber comunicação sobre futuras ofertas, promoções e novidades da plataforma, bem como sobre novos produtos e serviços, através do número de telefone.',
  },
];

const APPLICATION_OPTIONS = [{ value: 'applicationDarkMode', label: 'Ativar Modo Escuro' }];

// ----------------------------------------------------------------------

export default function AccountNotifications({ user }) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    emailCommunication: user?.settings.notifications.email || false,
    phoneCommunication: user?.settings.notifications.sms || false,
    applicationDarkMode: user?.settings.theme === 'dark',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async data => {
    try {
      const updateUser = {
        settings: {
          ...(user?.settings || {}),
          notifications: {
            ...(user?.settings?.notifications || {}),
            email: data.emailCommunication,
            sms: data.phoneCommunication,
          },
        },
      };

      await fetch('/api/account', {
        method: 'PUT',
        body: JSON.stringify(updateUser),
      });

      enqueueSnackbar('Guardado com sucesso!');
    } catch (error) {
      enqueueSnackbar('Erro ao Save, por favor tente novamnete.', { variant: 'error' });

      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="overline" component="div" sx={{ color: 'text.secondary' }}>
          Atividade
        </Typography>

        <Stack alignItems="flex-start" spacing={1} sx={{ mt: 2 }}>
          {ACTIVITY_OPTIONS.map(activity => (
            <RHFSwitch
              key={activity.value}
              name={activity.value}
              label={activity.label}
              sx={{ m: 0 }}
            />
          ))}
        </Stack>

        <Stack>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ ml: 'auto' }}
            disabled={!isDirty}>
            Guardar
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
