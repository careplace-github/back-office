// react
import { useEffect, useState } from 'react';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { PATHS } from 'src/routes';
import { useSession } from 'next-auth/react';
// hooks
import useSessionStorage from 'src/hooks/use-session-storage';
// components
import { useSettingsContext } from 'src/contexts';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSnackbar } from 'src/components/snackbar';
//
import Iconify from 'src/components/iconify';
import ConfirmDialog from 'src/components/confirm-dialog';
import HealthUnitNewViewEditForm from '../components/HealthUnitNewViewEditForm';

// ----------------------------------------------------------------------

export default function EditUserView({ services, collaborator }) {
  const { data: user } = useSession();

  const [permissions, setPermissions] = useSessionStorage('permissions', '');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    }
  }, [user, setPermissions]);

  const { themeStretch } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCollaborator = async _user => {
    if (_user.role === 'caregiver') {
      try {
        const response = await fetch(`/api/caregivers/${_user._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.error) {
          switch (response.error.code) {
            case 'CaregiverIsAssociatedWithOrder':
              enqueueSnackbar('O cuidador está associado a um pedido e não pode ser eliminado.', {
                variant: 'error',
              });

              break;

            default:
              enqueueSnackbar('Erro ao eliminar cuidador. Por favor tente novamente.', {
                variant: 'error',
              });
              break;
          }
        } else {
          enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });
        }
        // window.location.href = '';
      } catch (error) {
        console.error('ERRO:', error);
      }
    } else {
      try {
        const response = await fetch(`/api/health-units/${_user._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.error) {
          switch (response.error.code) {
            default:
              enqueueSnackbar('Erro ao eliminar colaborador. Por favor tente novamente.', {
                variant: 'error',
              });
              break;
          }
        } else {
          enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });
        }

        // window.location.href = '';
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Editar Colaborador"
            links={[
              {
                name: 'Health Units',
                href: '',
              },
              { name: collaborator?.name },
            ]}
            action={
              permissions.includes('admin') && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleOpenConfirm}
                  sx={{}}
                  startIcon={<Iconify icon="mdi:delete-outline" />}>
                  Eliminar
                </Button>
              )
            }
          />

          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Eliminar Colaborador"
            content={
              <>
                Tem a certeza que pretende eliminar o seguinte colaborador:
                <br />
                <strong> {collaborator?.name} </strong> ?
              </>
            }
            action={
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteCollaborator(collaborator);
                  handleCloseConfirm();
                }}>
                Eliminar
              </Button>
            }
          />

          <HealthUnitNewViewEditForm isEdit editUser={collaborator} services={services} />
        </Container>
      )}
    </>
  );
}
