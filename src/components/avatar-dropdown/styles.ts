// ----------------------------------------------------------------------

export const ITEM_HEIGHT = 40;

export const inputStyle = {
  '& .MuiSelect-select': {
    py: 1.75,
  },
};

export const menuItemStyle = {
  p: 2,
  gap: '10px',
};

export const menuEmptyItemStyle = {
  p: 2,
  fontSize: '14px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(145, 158, 171, 0.08)',
    borderRadius: '8px',
  },
};

export const MenuProps = {
  PaperProps: {
    sx: {
      px: 1,
      maxHeight: ITEM_HEIGHT * 5,
    },
  },
};
