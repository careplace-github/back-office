import { Box, Autocomplete, Checkbox, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { IServiceProps } from 'src/types/service';

type Props = {
  filterServices: IServiceProps[];
  onChangeLanguage: (keyword: IServiceProps[]) => void;
  services: IServiceProps[]; // Use the same type for services and filterServices
};

export default function FilterServices({ services, filterServices, onChangeLanguage }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const aux: string[] = [];
    filterServices.forEach(item => {
      aux.push(item._id);
    });
    setSelectedIds(aux);
  }, [filterServices]);

  useEffect(() => {
    // Create a mutable copy of value when it changes
    const mutableValue = Array.from(filterServices);
    onChangeLanguage(mutableValue);
  }, [filterServices, onChangeLanguage]);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      disableCloseOnSelect
      options={services}
      getOptionLabel={option => option.name}
      value={filterServices}
      onChange={(event, value) => {
        onChangeLanguage(value as IServiceProps[]); // Explicitly cast value
      }}
      renderInput={params => (
        <TextField
          {...params}
          hiddenLabel
          variant="filled"
          placeholder={filterServices.length > 0 ? undefined : 'Todos os serviços'}
          InputProps={{
            ...params.InputProps,
            autoComplete: 'search',
            sx: { pb: 1 },
          }}
        />
      )}
      ChipProps={{ color: 'info', size: 'small' }}
      renderOption={(props, option, { selected }) => (
        <Box component="li" {...props} sx={{ p: '3px' }} key={option._id}>
          <Checkbox
            key={option._id}
            size="small"
            disableRipple
            checked={selectedIds.includes(option._id)}
          />
          {option.name}
        </Box>
      )}
    />
  );
}
