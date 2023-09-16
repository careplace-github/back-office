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
  Box,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  CircularProgress,
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

const COUNTRIES_OPTIONS = [{ code: 'all', label: 'All' }, ...countries];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'restricted', label: 'Restricted' },
];

const TABLE_HEAD = [
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'country', label: 'Country', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function healthUnitsListView() {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

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

  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [filterName, setFilterName] = useState('');

  const [filterType, setFilterType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [dataFiltered, setDataFiltered] = useState<ICollaboratorProps[]>([]);
  const fetchHealthUnits = async () => {
    try {
      const response = await fetch(
        `/api/health-units?page=${page <= 0 ? 1 : page + 1}&documentsPerPage=${rowsPerPage}`,
        {
          method: 'GET',
        }
      );

      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setPage(response.page - 1);

      const filteredData = applyFilter({
        inputData: response.data,
        comparator: getComparator(order, orderBy),
        filterName,
        filterCountry,
        filterType,
        filterStatus,
      });

      setDataFiltered(filteredData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetchHealthUnits();
  }, [page, rowsPerPage, order, orderBy, filterName, filterCountry, filterType, filterStatus]);

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const [openConfirm, setOpenConfirm] = useState(false);

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

  const handleFilterStatus = event => {
    setPage(0);
    setFilterStatus(event.target.value);
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
    try {
      const response = await fetch(`/api/health-units/${_healthUnit._id}`, {
        method: 'DELETE',
      });

      enqueueSnackbar('Health unit deleted successfully!', { variant: 'success' });

      fetchHealthUnits();
    } catch (error) {
      switch (error.code) {
        default:
          enqueueSnackbar('Error deleting health unit. Please try again.', {
            variant: 'error',
          });
          break;
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
    setFilterStatus('all');
    setPage(0);
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Health Units"
        links={[{ name: 'Health Units' }]}
        action={
          <NextLink href={PATHS.healthUnits.new} passHref>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Health Unit
            </Button>
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
          filterStatus={filterStatus}
          optionsRole={ROLES_OPTIONS}
          optionsCountry={COUNTRIES_OPTIONS}
          optionsStatus={STATUS_OPTIONS}
          onFilterName={handleFilterName}
          onFilterType={handleFilterType}
          onFilterCountry={handleFilterCountry}
          onFilterStatus={handleFilterStatus}
          onResetFilter={handleResetFilter}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px',
              }}>
              <CircularProgress sx={{ color: 'prmary.main' }} />
            </Box>
          )}
          {!isLoading && (
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={totalDocuments}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered?.map(row => (
                    <HealthUnitsTableRow
                      key={row._id}
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
                    emptyRows={emptyRows(page, rowsPerPage, totalDocuments)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          )}
        </TableContainer>

        <TablePaginationCustom
          count={totalDocuments}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterCountry,
  filterType,
  filterStatus,
}) {
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
    inputData = inputData.filter(
      healthUnit => healthUnit?.legal_information?.address?.country === filterCountry
    );
  }

  if (filterType !== 'all') {
    inputData = inputData.filter(healthUnit => healthUnit.role === filterType);
  }

  if (filterStatus !== 'all') {
    switch (filterStatus) {
      case 'enabled':
        inputData = inputData.filter(
          healthUnit => healthUnit.stripe_account?.requirements?.currently_due?.length === 0
        );

        break;

      case 'restricted':
        inputData = inputData.filter(
          healthUnit => healthUnit.stripe_account?.requirements?.currently_due?.length > 0
        );

        break;
      default:
        inputData = inputData.filter(
          healthUnit => healthUnit.stripe_account?.requirements?.currently_due?.length === 0
        );
        break;
    }
  }
  return inputData;
}
