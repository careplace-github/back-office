// routes
import { PATHS } from 'src/routes';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const footerLinksLoggedOut = [
  {
    order: '1',
    type: 'Main',
    subheader: 'Careplace',
    items: [
      { title: 'Entrar', path: PATHS.auth.login },
      { title: 'Registar', path: PATHS.demo },
      { title: 'Suporte', path: PATHS.support },
    ],
  },
  {
    order: '2',
    type: 'Main',
    subheader: 'Instituições de Saúde',
    items: [
      { title: 'Empresas SAD', path: PATHS.demo },
      { title: 'Residências Sénior', path: PATHS.demo },
      { title: 'Lares de Idosos', path: PATHS.demo },
    ],
  },
];

export const footerLinksLoggedIn = [
  {
    order: '1',
    type: 'Main',
    subheader: 'Careplace',
    items: [{ title: 'Torne-se Cuidador', path: '' }],
  },
  {
    order: '2',
    type: 'Main',
    subheader: 'Encontrar',
    items: [
      { title: 'Empresas SAD', path: '' },
      { title: 'Serviços', path: '' },
    ],
  },
];

export const navConfig = [];
