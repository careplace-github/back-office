// utils
import Weekdays from 'src/data/Weekdays';
// @mui
import { MenuItem, Checkbox, FormControl, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
//
import { inputStyle, menuItemStyle, MenuProps } from './styles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  filterWeekdays: number[];
  onChangeLevel: (event: SelectChangeEvent<number[]>) => void;
};

export default function FilterWeekdays({ filterWeekdays = [], onChangeLevel }: Props) {
  return (
    <FormControl fullWidth variant="filled" sx={inputStyle}>
      <Select
        multiple
        displayEmpty
        value={filterWeekdays}
        onChange={onChangeLevel}
        MenuProps={MenuProps}
        renderValue={items => {
          const selected: string[] = [];
          items.forEach(id => {
            Weekdays.forEach(day => {
              if (day.value === id) {
                selected.push(day.text);
              }
            });
          });
          if (items.length === 0) {
            return (
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Todos os dias
              </Typography>
            );
          }
          return (
            <Typography variant="subtitle2" component="span">
              {selected.join(', ')}
            </Typography>
          );
        }}>
        {Weekdays.map(day => (
          <MenuItem key={day.value} value={day.value} sx={menuItemStyle}>
            <Checkbox size="small" checked={filterWeekdays.includes(day.value)} />
            {day.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
