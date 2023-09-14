export const PATHS = {
  home: `/`,

  root: '/app/dashboard',

  // ------------- Common -------------
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  demo: '/demo',
  support: '/support',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',

  // ------------- Auth -------------
  auth: {
    root: '/app/auth',
    login: '/app/auth/login',
    verify: '/app/auth/verify-code',
    forgotPassword: `/app/auth/forgot-password`,
    resetPassword: '/app/auth/reset-password',
    afterLogin: '/app/dashboard',
    verifyPhone: '/app/auth/verify-phone',
  },

  // ------------- App -------------
  account: {
    root: '/app/account',
    settings: '/app/account/settings',
  },

  company: {
    root: '/app/company',
    account: '/app/company/account',
    settings: `/app/company/account/settings`,
  },

  dashboard: '/app/dashboard',
  calendar: '/app/calendar',
  orders: {
    root: '/app/orders',
    new: '/app/orders/new',
    view: (id: string) => `/app/orders/${id}/view`,
    edit: (id: string) => `/app/orders/${id}/edit`,
  },
  users: {
    root: '/app/users',
    new: '/app/users/new',
    view: (id: string) => `/app/users/${id}/view`,
    edit: (id: string) => `/app/users/${id}/edit`,
  },
};
