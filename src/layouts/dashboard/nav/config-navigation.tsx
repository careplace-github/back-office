// routes
import { PATHS } from 'src/routes';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  mail: icon('ic_mail'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  // dashboard: icon('material-symbols:space-dashboard-rounded'),
  //   calendar: icon('ic_calendar'),
  //   file: icon('ic_file'),
  // user: icon('ic_user'),
  //   invoice: icon('ic_invoice'),
  //   chat: icon('ic_chat'),

  dashboard: icon('1_ic_dashboard'),
  calendar: icon('1_ic_calendar'),
  file: icon('1_ic_file'),
  user: icon('1_ic_user'),
  case: icon('1_ic_case'),
  invoice: icon('1_ic_invoice'),
  chat: icon('1_ic_chat'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: ' ',
    items: [
      {
        title: 'Dashboard',
        path: PATHS.dashboard,
        icon: ICONS.dashboard,
        permission: 'dashboard_view',
      },
      { title: 'Pedidos', path: PATHS.orders.root, icon: ICONS.file, permission: 'orders_view' },

      {
        title: 'Agendamentos',
        path: PATHS.calendar,
        icon: ICONS.calendar,
        permission: 'app_user',
        iconWidth: '15px',
        iconHeight: '15px',
      },
      { title: 'Equipa', path: PATHS.users.root, icon: ICONS.user, permission: 'users_view' },

      {
        title: 'Recrutamento',
        path: '#disabled',
        icon: ICONS.case,
        info: <Label color="info">Brevemente</Label>,
        disabled: true,
        permission: 'app_user',
      },

      {
        title: 'Faturação',
        path: '#disabled',
        icon: ICONS.invoice,
        info: <Label color="info">Brevemente</Label>,
        disabled: true,
        permission: 'app_user',
      },

      {
        title: 'Chat',
        path: '#disabled',
        icon: ICONS.chat,
        info: <Label color="info">Brevemente</Label>,
        disabled: true,
        permission: 'app_user',
      },
    ],
  },
];

export default navConfig;
