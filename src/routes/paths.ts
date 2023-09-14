export const PATHS = {
  home: `/`,

  root: '/',

  // ------------- Common -------------
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',

  // ------------- Auth -------------
  auth: {
    root: '/auth',
    login: '/auth/login',
    verify: '/auth/verify-code',
    forgotPassword: `/auth/forgot-password`,
    resetPassword: '/auth/reset-password',
    afterLogin: '/health-units',
    verifyPhone: '/auth/verify-phone',
  },

  // ------------- App -------------
  account: {
    root: '/account',
    settings: '/account/settings',
  },

  healthUnits: {
    root: '/health-units',
    new: '/health-units/new',
    view: (id: string) => `/health-units/${id}/view`,
    edit: (id: string) => `/health-units/${id}/edit`,
  },
};
