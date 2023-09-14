export function hasPermission(permission: string, userPermissions: string[]): boolean {
  const _hasPermission = userPermissions?.includes(permission);

  return _hasPermission;
}
