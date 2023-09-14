// ----------------------------------------------------------------------

export type IOfficeMapProps = {
  email: string;
  photo?: string;
  address: string;
  country?: string;
  latlng: number[];
  phoneNumber: string;
};

export type ICountriesProps = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean | undefined;
};

export type ISocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
};
