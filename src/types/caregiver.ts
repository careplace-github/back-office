// ----------------------------------------------------------------------

export type ICaregiverProps = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  health_unit: string;
  birthdate: Date;
  address: {
    street: string;
    postal_code: string;
    city: string;
    country: string;
  };
  role: string;
  profile_picture: string;
  services: string[];
};
