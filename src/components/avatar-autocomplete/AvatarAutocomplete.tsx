import React, { useState } from 'react';
// mui
import { Autocomplete, TextField, Avatar, Box, Stack } from '@mui/material';
import Iconify from '../iconify/Iconify';

type props = {
  options: Array<any>;
  onChange: Function;
  onEditClick: () => void;
  sx?: any;
  label: string;
  disabled?: boolean;
  selectedItem: any | undefined | null;
};

function AvatarAutocomplete({
  options,
  onChange,
  sx,
  label,
  disabled,
  selectedItem,
  onEditClick,
}: props) {
  const [editMode, setEditMode] = useState<boolean>(false);
  return !selectedItem || editMode ? (
    <Autocomplete
      options={options}
      onChange={(event, newValue) => {
        if (newValue) {
          setEditMode(false);
        }
        onChange(event, newValue);
      }}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => {
        return option.value === value.value;
      }}
      getOptionLabel={option => option.text}
      renderOption={(props, option: any) => (
        <Box {...(props as any)} sx={{ gap: '10px' }}>
          <Avatar alt={option.text} sx={{ width: '35px', height: '35px' }} src={option.avatar} />
          {option.text}
        </Box>
      )}
      sx={{ ...sx, width: '100%' }}
      renderInput={params => <TextField label={label} {...params} />}
    />
  ) : (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '100%', height: '56px' }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ gap: '10px' }}>
        <Avatar sx={{ width: '35px', height: '35px' }} src={selectedItem.avatar} />
        {selectedItem.text}
      </Stack>
      <Iconify
        icon="material-symbols:close-rounded"
        onClick={() => {
          onEditClick();
          setEditMode(true);
        }}
        sx={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          color: 'text.secondary',
        }}
      />
    </Stack>
  );
}

export default AvatarAutocomplete;
