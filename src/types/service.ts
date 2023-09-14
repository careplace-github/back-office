import { ISocialLinks } from './utils';

// ----------------------------------------------------------------------

export type IServiceProps = {
  _id: string;
  name: string;
  description: string;
  short_description: string;
  image: string;

  title: string;
  category: string;
  coverImg: string;
  heroImg: string;
  createdAt: Date | string | number;
  galleryImgs: string[];
  website: string;
  socialLinks?: ISocialLinks;
  content: string;
  how_we_work: string;
  results: string;
};
