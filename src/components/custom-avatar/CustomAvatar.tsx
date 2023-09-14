import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Badge, Avatar } from '@mui/material';
//
import { CustomAvatarProps } from './types';

// ----------------------------------------------------------------------

const getCharAtName = (name: string) => name && name.charAt(0).toUpperCase();

const getColorByName = (name: string) => {
  return 'default';
};

// ----------------------------------------------------------------------

const CustomAvatar = forwardRef<HTMLDivElement, CustomAvatarProps & { type?: 'normal' | 'custom' }>(
  ({ type = 'normal', color, name = '', BadgeProps, children, sx, ...other }, ref) => {
    const theme = useTheme();

    const charAtName = getCharAtName(name);

    const colorByName = getColorByName(name);

    const colr = color || colorByName;

    const getRenderContent = () => {
      if (type === 'normal') {
        return <Avatar sx={sx} {...other} />;
      }
      if (type === 'custom' && colr === 'default') {
        return (
          <Avatar ref={ref} sx={sx} {...other}>
            {name && charAtName}
            {children}
          </Avatar>
        );
      }
      if (type === 'custom') {
        return (
          <Avatar
            ref={ref}
            sx={{
              color: theme.palette[colr]?.contrastText,
              backgroundColor: theme.palette[colr]?.main,
              fontWeight: theme.typography.fontWeightMedium,
              ...sx,
            }}
            {...other}>
            {name && charAtName}
            {children}
          </Avatar>
        );
      }
      return null;
    };

    const renderContent = getRenderContent();

    return BadgeProps ? (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        {...BadgeProps}>
        {renderContent}
      </Badge>
    ) : (
      renderContent
    );
  }
);

export default CustomAvatar;
