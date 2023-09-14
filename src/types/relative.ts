// ----------------------------------------------------------------------

export type IRelativeProps = {
  _id?: string;
  name: string;
  profile_picture: string;
  kinship: string;
  birthdate: string;
  phone_number: string;
  address: {
    street: string;
    city: string;
    country: string;
    postal_code: string;
  };
  gender: string;
  medical_conditions: string;
};
