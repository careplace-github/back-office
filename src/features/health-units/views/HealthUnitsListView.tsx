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
import { roles, countries } from 'src/data';
// types
import { ICollaboratorProps } from 'src/types/collaborator';
//
import HealthUnitsTableToolbar from '../components/list/HealthUnitsTableToolbar';
import HealthUnitsTableRow from '../components/list/HealthUnitsTableRow';

// ----------------------------------------------------------------------

// Add the object { value: 'all', label: 'Todos' } to the array
const ROLES_OPTIONS = [{ value: 'all', label: 'All' }, ...roles];

const COUNTRIES_OPTIONS = [{ value: 'all', label: 'All' }, ...countries];

const TABLE_HEAD = [
  { id: 'name', label: 'Company', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'role', label: 'Phone', align: 'left' },
  { id: 'status', label: 'Country', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function healthUnitsListView({ healthUnits }) {
  const { data: healthUnit } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState<ICollaboratorProps[]>([]);

  useEffect(() => {
    setTableData(healthUnits);
  }, [healthUnits]);

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

  const [filterType, setFilterType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');

  const { enqueueSnackbar } = useSnackbar();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterType,
    filterCountry,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterType !== 'Selecionar' || filterCountry !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterType) ||
    (!dataFiltered.length && !!filterCountry);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterCountry = event => {
    setPage(0);
    setFilterCountry(event.target.value);
  };

  const handleFilterName = event => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterType = event => {
    setPage(0);
    setFilterType(event.target.value);
  };

  const handleDeleteRow = async _healthUnit => {
    if (_healthUnit.role === 'caregiver') {
      try {
        const response = await fetch(`/api/health-units/${_healthUnit._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });

        window.location.href = '';
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
        const response = await fetch(`/api/health-units/${_healthUnit._id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        enqueueSnackbar('Colaborador eliminado com sucesso!', { variant: 'success' });

        window.location.href = '';
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
    push(PATHS.healthUnits.edit(paramCase(id)));
  };

  const handleViewRow = id => {
    push(PATHS.healthUnits.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterType('all');
    setFilterCountry('all');
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Health Units"
            links={[{ name: 'Health Units' }]}
            action={
              <NextLink href={PATHS.healthUnits.new} passHref>
                {healthUnit?.permissions?.includes('admin') && (
                  <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                    Add Health Unit
                  </Button>
                )}
              </NextLink>
            }
          />

          <Card>
            <Divider />

            <HealthUnitsTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              filterType={filterType}
              filterCountry={filterCountry}
              optionsRole={ROLES_OPTIONS}
              optionsCountry={COUNTRIES_OPTIONS}
              onFilterName={handleFilterName}
              onFilterType={handleFilterType}
              onFilterCountry={handleFilterCountry}
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
                        <HealthUnitsTableRow
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
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterCountry, filterType }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map(el => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      healthUnit =>
        healthUnit.business_profile.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterCountry !== 'all') {
    inputData = inputData.filter(healthUnit => healthUnit.addresses[0].country === filterCountry);
  }

  if (filterType !== 'all') {
    inputData = inputData.filter(healthUnit => healthUnit.role === filterType);
  }

  return inputData;
}
