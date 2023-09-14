import { useCallback, useEffect, useState } from 'react';
import sumBy from 'lodash/sumBy';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Grid,
  Dialog,
  DialogTitle,
} from '@mui/material';
// routes
import { PATHS } from 'src/routes';
// utils
import { fTimestamp } from 'src/utils/formatTime';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useSettingsContext } from 'src/contexts';
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
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  selectEvent,
  selectRange,
  onOpenModal,
  onCloseModal,
} from 'src/redux/slices/calendar';
// assets
import {
  BookingIllustration,
  CheckInIllustration,
  CheckOutIllustration,
} from 'src/assets/illustrations';
// lib
import axios from 'src/lib/axios';
// types
import { LabelColor } from 'src/components/label';
//
import BookingWidgetSummary from 'src/features/dashboard/components/BookingWidgetSummary';
import { useSnackbar } from 'src/components/snackbar';
import OrdersTableToolbar from '../components/list/OrdersTableToolbar';
import OrdersTableRow from '../components/list/OrdersTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'filterQueryNumber', label: 'Cliente', align: 'left' },
  { id: 'createDate', label: 'Serviços', align: 'left' },
  { id: 'createDate', label: 'Cuidador', align: 'left' },
  { id: 'dueDate', label: 'Recorrência', align: 'left' },
  { id: 'dueDate', label: 'Horário', align: 'left' },
  { id: 'status', label: 'Estado', align: 'left' },
  { id: '' },
];

const ORDER_TYPE_OPTIONS = [
  {
    value: 'all',
    label: 'Todos',
  },
  {
    value: 'marketplace',
    label: 'Online',
  },
  {
    value: 'external',
    label: 'Offline',
  },
];

// ----------------------------------------------------------------------

export default function OrdersListView({ orders }) {
  const [isLoading, setIsLoading] = useState(false);

  const [pendingOrders, setPendingOrders] = useState(
    orders.filter(order => order.status === 'new').length
  );
  const [awaitingVisitOrders, setAwaitingVisitOrders] = useState(
    orders.filter(order => order.status === 'accepted').length
  );
  const [activeOrders, setActiveOrders] = useState(
    orders.filter(order => order.status === 'active').length
  );

  const [tableData, setTableData] = useState(orders);

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

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
  } = useTable({ defaultOrderBy: 'createDate' });

  const [filterQuery, setFilterQuery] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const hasNewOrders = tableData.some(item => item.status === 'new');
  const [filterStatus, setFilterStatus] = useState(hasNewOrders ? 'new' : 'all');

  const [filterOrderType, setFilterOrderType] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterQuery,
    filterOrderType,
    filterStatus,
    filterStartDate,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered = filterQuery !== '' || filterOrderType !== 'all' || filterStartDate;

  const isNotFound =
    (!dataFiltered.length && !!filterQuery) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterOrderType) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = status => {
    // Filter by status
    const filteredData =
      status !== 'all' ? tableData.filter(item => item.status === status) : tableData;

    // Filter by order type if it's not 'all'
    const filteredDataByType =
      filterOrderType !== 'all'
        ? filteredData.filter(item => item.type === filterOrderType)
        : filteredData;

    return filteredDataByType.length;
  };

  const getTotalPriceByStatus = status =>
    sumBy(
      tableData.filter(item => item.status === status),
      'totalPrice'
    );
  const { enqueueSnackbar } = useSnackbar();

  const getPercentByStatus = status => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Todos',
      color: 'default',
      count: getLengthByStatus('all'),
    },
    { value: 'new', label: 'Novos', color: 'info', count: getLengthByStatus('new') },
    {
      value: 'accepted',
      label: 'Aguardam Visita',
      color: 'secondary',
      count: getLengthByStatus('accepted'),
    },
    {
      value: 'pending_payment',
      label: 'Pagamento Pendente',
      color: 'warning',
      count: getLengthByStatus('pending_payment'),
    },
    { value: 'active', label: 'Ativos', color: 'success', count: getLengthByStatus('active') },
    {
      value: 'completed',
      label: 'Concluídos',
      color: 'primary',
      count: getLengthByStatus('completed'),
    },
  ];

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

  const handleDeleteRow = async id => {
    try {
      await fetch(`/api/orders/home-care/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      enqueueSnackbar('Erro ao eliminar pedido. Por favor tente novamente.', { variant: 'error' });
    }

    enqueueSnackbar('Pedido eliminado com sucesso', { variant: 'success' });

    const deleteRow = tableData.filter(row => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = _selected => {
    const deleteRows = tableData.filter(row => !_selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (_selected.length === dataInPage.length) {
        setPage(page - 1);
      } else if (_selected.length === dataFiltered.length) {
        setPage(0);
      } else if (_selected.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - _selected.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = id => {
    push(PATHS.orders.edit(id));
  };

  const handleViewRow = (id, status) => {
    push(PATHS.orders.view(id));
  };

  const handleResetFilter = () => {
    setFilterQuery('');
    setFilterStatus('new');
    setFilterOrderType('all');
    setFilterStartDate(null);
  };
  const dispatch = useDispatch;

  const COLOR_OPTIONS = [
    '#00AB55', // theme.palette.primary.main,
    '#1890FF', // theme.palette.info.main,
    '#54D62C', // theme.palette.success.main,
    '#FFC107', // theme.palette.warning.main,
    '#FF4842', // theme.palette.error.main
    '#04297A', // theme.palette.info.darker
    '#7A0C2E', // theme.palette.error.darker
  ];
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
              heading="Gerir Pedidos"
              links={[
                {
                  name: 'Pedidos',
                },
              ]}
              action={
                // onClick={handleOpenModal}>

                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  href={PATHS.orders.new}>
                  Novo Pedido
                </Button>
              }
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <BookingWidgetSummary
                  title="Pedidos Pendentes"
                  total={pendingOrders}
                  icon={<BookingIllustration />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <BookingWidgetSummary
                  title="Aguardam Visita "
                  total={awaitingVisitOrders}
                  icon={<CheckOutIllustration />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <BookingWidgetSummary
                  title="Pedidos Ativos"
                  total={activeOrders}
                  icon={<CheckInIllustration />}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Card>
                  <Tabs
                    value={filterStatus}
                    onChange={handleFilterStatus}
                    sx={{
                      px: 5,
                    }}>
                    {TABS.map(tab => (
                      <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        icon={
                          <Label color={tab.color as LabelColor} sx={{ mr: 1 }}>
                            {tab.count}
                          </Label>
                        }
                      />
                    ))}
                  </Tabs>

                  <Card>
                    <OrdersTableToolbar
                      isFiltered={isFiltered}
                      filterQuery={filterQuery}
                      filterOrderType={filterOrderType}
                      filterStartDate={filterStartDate}
                      optionsOrderType={ORDER_TYPE_OPTIONS}
                      onFilterQuery={e => setFilterQuery(e.target.value)}
                      onFilterOrderType={e => setFilterOrderType(e.target.value)}
                      onFilterStartDate={date => setFilterStartDate(date)}
                      onResetFilter={handleResetFilter}
                    />
                  </Card>

                  <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <TableSelectedAction
                      dense={dense}
                      numSelected={selected.length}
                      rowCount={tableData.length}
                      onSelectAllRows={checked =>
                        onSelectAllRows(
                          checked,
                          tableData.map(row => row.id)
                        )
                      }
                      action={
                        <Stack direction="row">
                          <Tooltip title="Enviar">
                            <IconButton color="primary">
                              <Iconify icon="ic:round-send" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Download">
                            <IconButton color="primary">
                              <Iconify icon="eva:download-outline" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Imprimir">
                            <IconButton color="primary">
                              <Iconify icon="eva:printer-fill" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar Pedido">
                            <IconButton color="primary" onClick={handleOpenConfirm}>
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                    />

                    <Scrollbar>
                      <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                        <TableHeadCustom
                          order={order}
                          orderBy={orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={tableData.length}
                          onSort={onSort}
                        />

                        <TableBody>
                          {dataFiltered
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map(row => (
                              <OrdersTableRow
                                key={row.id}
                                row={row}
                                selected={selected.includes(row._id)}
                                onSelectRow={() => onSelectRow(row._id)}
                                onViewRow={() => handleViewRow(row._id, row.staus)}
                                onEditRow={() => handleEditRow(row._id)}
                                onDeleteRow={() => handleDeleteRow(row._id)}
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
              </Grid>
            </Grid>
          </Container>

          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content={
              <>
                Tem a certeza que pretende eliminar <strong> {selected.length} </strong> items?
              </>
            }
            action={
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleDeleteRows(selected);
                  handleCloseConfirm();
                }}>
                Eliminar
              </Button>
            }
          />
        </>
      )}
    </>
  );
}
// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterQuery,
  filterStatus,
  filterOrderType,
  filterStartDate,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map(el => el[0]);

  if (filterQuery) {
    inputData = inputData.filter(
      order =>
        order?.patient?.name?.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1 ||
        order?.caregiver?.name?.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1 ||
        order?.order_number?.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1
    );
  }
  if (filterStatus !== 'all') {
    inputData = inputData.filter(order => order.status === filterStatus);
  }

  if (filterOrderType !== 'all') {
    inputData = inputData.filter(order => order.type === filterOrderType);
  }

  if (filterStartDate) {
    inputData = inputData.filter(order => {
      const orderDate = new Date(order.schedule_information.start_date).getTime();
      const filterDate = new Date(filterStartDate).getTime();
      return orderDate >= filterDate;
    });
  }

  return inputData;
}
