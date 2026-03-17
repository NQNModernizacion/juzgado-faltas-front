export type RSOption = { label: string; value: string | number };

export const getPermissionsForm = (
  permissions: any[] | null,
  role: any | null
) => {
  if (!permissions) return null;

  const permissionsForm = permissions.map((p) => ({ ...p, checked: false }));

  if (role?.permissions?.length) {
    role.permissions.forEach((p: any) => {
      const idx = permissionsForm.findIndex((pf) => pf.id === p.id);
      if (idx >= 0) permissionsForm[idx].checked = true;
    });
  }

  return permissionsForm;
};