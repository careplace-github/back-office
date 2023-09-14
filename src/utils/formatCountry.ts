import { countries } from 'src/data';

export function fCountry(country: string) {
  const foundCountry = countries.find(c => c.code === country);
  return foundCountry ? foundCountry.label : '';
}
