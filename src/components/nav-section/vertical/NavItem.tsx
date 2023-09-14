import { useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
// hooks
import useSessionStorage from 'src/hooks/use-session-storage';

// @mui
import { Box, Tooltip, Link, ListItemText } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
//
import Iconify from '../../iconify';
//
import { NavItemProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';
import { hasPermission } from '../utils';

// ----------------------------------------------------------------------

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  ...other
}: NavItemProps) {
  const { data: user } = useSession() || {};

  const [permissions, setPermissions] = useSessionStorage('permissions', '');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    }
  }, [user, setPermissions]);

  const { translate } = useLocales();

  const {
    title,
    path,
    icon,
    info,
    children,
    disabled,
    caption,
    permission,
    iconWidth,
    iconHeight,
  } = item;

  const subItem = depth !== 1;

  const renderContent = (
    <StyledItem depth={depth} active={active} disabled={disabled} caption={!!caption} {...other}>
      {icon && (
        <Box
          sx={{
            width: '30px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <StyledIcon sx={{ width: iconWidth || '18px', height: iconHeight || '18px' }}>
            {icon}
          </StyledIcon>
        </Box>
      )}

      {subItem && (
        <StyledIcon>
          <StyledDotIcon active={active && subItem} />
        </StyledIcon>
      )}

      <ListItemText
        primary={`${translate(title)}`}
        secondary={
          caption && (
            <Tooltip title={`${translate(caption)}`} placement="top-start">
              <span>{`${translate(caption)}`}</span>
            </Tooltip>
          )
        }
        primaryTypographyProps={{
          noWrap: true,
          component: 'span',
          variant: active ? 'subtitle2' : 'body2',
        }}
        secondaryTypographyProps={{
          noWrap: true,
          variant: 'caption',
        }}
      />

      {info && (
        <Box component="span" sx={{ lineHeight: 0 }}>
          {info}
        </Box>
      )}

      {!!children && (
        <Iconify
          width={16}
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          sx={{ ml: 1, flexShrink: 0 }}
        />
      )}
    </StyledItem>
  );

  const renderItem = () => {
    // ExternalLink
    if (isExternalLink)
      return (
        <Link href={path} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      );

    // Has child
    if (children) {
      return renderContent;
    }

    // Default
    return (
      <Link component={NextLink} href={path} underline="none">
        {renderContent}
      </Link>
    );
  };

  return (!!permission && hasPermission(permission, permissions || []) && renderItem()) || null;
}
