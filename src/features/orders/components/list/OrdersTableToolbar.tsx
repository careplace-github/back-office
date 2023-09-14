import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from 'src/components/iconify';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

InvoiceTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterQuery: PropTypes.string,
  onFilterQuery: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterOrderType: PropTypes.string,
  onFilterOrderType: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  filterStartDate: PropTypes.instanceOf(Date),
  optionsOrderType: PropTypes.arrayOf(PropTypes.object),
};

export default function InvoiceTableToolbar({
  isFiltered,
  filterQuery,
  onFilterQuery,
  filterOrderType,
  onResetFilter,
  optionsOrderType,
  filterStartDate,
  onFilterOrderType,
  onFilterStartDate,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}>
      <TextField
        fullWidth
        select
        label="Origem de Pedido"
        value={filterOrderType}
        onChange={onFilterOrderType}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { maxHeight: 220 },
            },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}>
        {optionsOrderType.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
              '&:first-of-type': { mt: 0 },
              '&:last-of-type': { mb: 0 },
            }}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker label="Data de Início" value={filterStartDate} onChange={onFilterStartDate} />

      <TextField
        fullWidth
        value={filterQuery}
        onChange={onFilterQuery}
        placeholder="Pesquisa por cliente, cuidador, número de pedido..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}>
          Limpar
        </Button>
      )}
    </Stack>
  );
}
