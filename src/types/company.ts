//
import { ICountriesProps, ISocialLinks } from './utils';

// ----------------------------------------------------------------------

export type ICompanyResponsibleProps = {
  id?: string;
  name?: string;
  role?: string;
  picture?: string;
  about?: string;
  quotes?: string;
  phoneNumber?: string;
  verified?: boolean;
  ratings?: number;
  reviews?: number;
  socialLinks?: ISocialLinks;
  courses?: number;
  students?: number;
};

export type ICompanyProps = {
  _id: string;
  address?: {
    city?: string;
    coordinates: string[];
    country?: string;
    countryId?: string;
    fullAddress?: string;
    postal_code?: string;
    street?: string;
  };
  createdAt?: string;
  business_profile: {
    about: string;
    address?: {
      street?: string;
      city?: string;
      country?: string;
      postal_code?: string;
    };
    average_hourly_rate: number;
    email: string;
    logo: string;
    name: string;
    phone?: string;
    social_links?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
    website?: string;
  };
  is_active: boolean;
  rating: { average: number; count: number };
  service_area?: string[];
  services?: string[];
};

export type ICompanyFiltersProps = {
  filterFee: string[];
  filterLevel: string[];
  filterDuration: string[];
  filterCategories: string[];
  filterRating: string | null;
  filterLanguage: ICountriesProps[];
};
