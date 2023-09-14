// ----------------------------------------------------------------------

export type ICollaboratorProps = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  health_unit: string;
  address: {
    street: string;
    postal_code: string;
    city: string;
    country: string;
  };
  role: string;
  permissions: string[];
  profile_picture: string;
};

export type ISessionUser = {
  _id: string;
  name: string;
  email: string;
  profile_picture: string;
  role: string;
  permissions: string[];
};
