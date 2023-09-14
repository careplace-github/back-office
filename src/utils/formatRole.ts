import { roles } from 'src/data';

export function fRole(role: string) {
  const roleObj = roles.find(_roleObj => _roleObj.value === role);
  return roleObj ? roleObj.label : '';
}
