import { genders } from 'src/data';

export function fGender(gender: string) {
  const genderObj = genders.find(roleObj => roleObj.value === gender);
  return genderObj ? genderObj.label : '';
}
