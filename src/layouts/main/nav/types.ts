import { ListItemButtonProps } from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export type NavItemProps = {
  title: string;
  path: string;
  icon?: React.ReactElement;
  children?: {
    subheader: string;
    items: {
      title: string;
      path: string;
    }[];
  }[];
};

export interface NavItemDesktopProps extends ListItemButtonProps {
  item: NavItemProps;
  offsetTop?: boolean;
  active?: boolean;
  open?: boolean;
  subItem?: boolean;
  externalLink?: boolean;
}

export interface NavItemMobileProps extends ListItemButtonProps {
  item: NavItemProps;
  active?: boolean;
  open?: boolean;
  externalLink?: boolean;
}

export type NavListProps = {
  type: string;
  subheader: string;
  isNew?: boolean;
  cover?: string;
  items: { title: string; path: string; icon?: string }[];
  children?: Array<any>;
};

export type NavProps = {
  offsetTop: boolean;
  data: NavItemProps[];
};
