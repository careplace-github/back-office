import { paramCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// auth
import { useSettingsContext } from 'src/contexts';
// routes
import { PATHS } from 'src/routes';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSession } from 'next-auth/react';

// snackbar
import { useSnackbar } from 'src/components/snackbar';
// lib
import fetch from 'src/lib/fetch';
// data
import { roles } from 'src/data';
// types
import { ICollaboratorProps } from 'src/types/collaborator';
//
import UsersTableToolbar from '../components/list/UsersTableToolbar';
import UsersTableRow from '../components/list/UsersTableRow';

// ----------------------------------------------------------------------

// Add the object { value: 'all', label: 'Todos' } to the array
const ROLES_OPTIONS = [{ value: 'all', label: 'Todos' }, ...roles];

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'role', label: 'Cargo', align: 'left' },
  { id: 'status', label: 'Ativo', align: 'center' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function UsersListView({ collaborators }) {
  const { data: user } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState<ICollaboratorProps[]>([]);

  // Remove the logged user from the list
  collaborators.forEach((item, index) => {
    if (item._id === user?._id) {
      collaborators.splice(index, 1);
    }
  });

  useEffect(() => {
    setTableData(collaborators);
  }, [collaborators]);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { enqueueSnackbar } = useSnackbar();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterRole !== 'Selecionar' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = event => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = event => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async _user => {
    if (_user.role === 'caregiver') {
      try {
        const response = await fetch(`/api/caregivers/${_user._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });

        window.location.href = PATHS.users.root;
      } catch (error) {
        console.error(error);

        switch (error.code) {
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
      }
    } else {
      try {
        const response = await fetch(`/api/collaborators/${_user._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });

        window.location.href = PATHS.users.root;
      } catch (error) {
        switch (error.code) {
          case 'CaregiverIsAssociatedWithOrder':
            enqueueSnackbar('O Cuidador está associado a um pedido e não pode ser eliminado.', {
              variant: 'error',
            });
            break;

          default:
            enqueueSnackbar('Erro ao eliminar colaborador. Por favor tente novamente.', {
              variant: 'error',
            });
            break;
        }
      }
    }
  };

  const handleEditRow = id => {
    push(PATHS.users.edit(paramCase(id)));
  };

  const handleViewRow = id => {
    push(PATHS.users.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
              heading="Equipa"
              links={[{ name: 'Equipa' }]}
              action={
                <NextLink href={PATHS.users.new} passHref>
                  {user?.permissions?.includes('users_edit') && (
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                      Adicionar Colaborador
                    </Button>
                  )}
                </NextLink>
              }
            />

            <Card>
              <Divider />

              <UsersTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                filterRole={filterRole}
                optionsRole={ROLES_OPTIONS}
                onFilterName={handleFilterName}
                onFilterRole={handleFilterRole}
                onResetFilter={handleResetFilter}
              />

              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                  <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      numSelected={selected.length}
                      onSort={onSort}
                    />

                    <TableBody>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(row => (
                          <UsersTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row._id)}
                            onSelectRow={() => onSelectRow(row._id)}
                            onViewRow={() => handleViewRow(row._id)}
                            onEditRow={() => handleEditRow(row._id)}
                            onDeleteRow={() => handleDeleteRow(row)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
              />
            </Card>
          </Container>
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map(el => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      user => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter(user => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter(user => user.role === filterRole);
  }

  return inputData;
}
