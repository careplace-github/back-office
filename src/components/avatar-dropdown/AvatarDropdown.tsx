// @mui
import { MenuItem, Checkbox, FormControl, Typography, Avatar, Stack } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState, ReactNode } from 'react';
// types
import { inputStyle, menuItemStyle, MenuProps } from './styles';

// ----------------------------------------------------------------------

type Props = {
  selected: string;
  onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  options: Array<any>;
  selectText?: string;
  emptyText?: string;
  disabled?: boolean;
  avatarSize?: number;
  fontSize?: number;
  height?: string | number;
};

export function AvatarDropdown({
  options,
  selected,
  selectText,
  emptyText,
  disabled = false,
  avatarSize,
  height,
  fontSize,
  onChange,
}: Props) {
  return (
    <FormControl fullWidth variant="filled" sx={inputStyle}>
      <Select
        displayEmpty
        value={selected || ''}
        sx={{ height: height || '56px' }}
        onChange={onChange}
        MenuProps={MenuProps}
        disabled={disabled}
        renderValue={value => {
          if (!value) {
            return (
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {selectText}
              </Typography>
            );
          }

          const _selected = JSON.parse(value);
          return (
            <Stack gap="10px" direction="row" alignItems="center" justifyContent="flex-start">
              <Avatar
                src={_selected.profile_picture}
                sx={{
                  width: avatarSize || 40,
                  height: avatarSize || 40,
                }}
              />
              <Typography variant="subtitle2" component="span" fontSize={fontSize || 14}>
                {_selected.name}
              </Typography>
            </Stack>
          );
        }}>
        {options?.length > 0 ? (
          options.map(item => (
            <MenuItem
              key={item._id}
              value={JSON.stringify(item)}
              sx={{
                ...menuItemStyle,
                fontSize: fontSize || 14,
              }}>
              <Avatar
                src={item.profile_picture}
                sx={{
                  width: avatarSize || 40,
                  height: avatarSize || 40,
                }}
              />
              {item.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem
            disabled
            key={emptyText}
            sx={{
              ...menuItemStyle,
              fontSize: fontSize || 14,
            }}>
            {emptyText}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
