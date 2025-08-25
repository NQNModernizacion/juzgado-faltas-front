import { postForm } from "@/api";



export const initialState = {
    role: {
        name: "",
        description: "",
    },
    permission: {
        name: "",
        description: "",
    },
}

/** Completa el tipo de dato PermissionForm, en funcion de los permisos que tiene cada uno de los roles*/
export const getPermissionsForm = (permissions, role) => {
  if (!permissions) {
    return null;
  }

  /* Primero asumimos que ningun permiso se encuentra en el rol, sirve para resetear el estado */
  const permissions_form = permissions.map((p) => ({ ...p, checked: false }));

  if (role) {
    /* Por cada permiso dentro del rol seteamos dentro de permissions_form que existe */
    role.permissions?.forEach((p) => {
      const index = permissions_form.findIndex((pf) => pf.id === p.id);
      permissions_form[index].checked = true;
    });
  }

  return permissions_form;
};

export const onChange = (e, setPermissionRolForm) => {
  const { id, value } = e.target;
  
  setPermissionRolForm((state) => {
    const updatedState = { ...state };
    
    if (id.startsWith("role_")) {
      updatedState.role = { ...updatedState.role, [id.replace("role_", "")]: value };
    } else if (id.startsWith("permission_")) {
      updatedState.permission = { ...updatedState.permission, [id.replace("permission_", "")]: value };
    }

    return updatedState;
  });
};


export const saveElement = async (permissionRolForm, setData, setState, model, edit) => {
  setState((state) => ({ ...state, loading: true }));

  const data = await postForm("permissions/save_element", {
    model,
    element: permissionRolForm[model],
    edit,
  });

  setState((state) => ({ ...state, loading: false }));

  if (data) {
    setData(data);
  }
};

export const changeCheckPermission = (pf, permissionsForm, setPermissionsForm) => {
  if (permissionsForm) {
    const permissions_form = [...permissionsForm];
    const index = permissionsForm.findIndex((_pf) => _pf.id === pf.id);
    permissions_form[index].checked = !permissions_form[index].checked;

    setPermissionsForm([...permissionsForm]);
  }
};

export const changeRolePermissions = async (role, permissionsForm, setState, setData) => {
  if (role && permissionsForm) {
    setState((state) => ({ ...state, loading: true }));

    const data = await postForm(`permissions/change_role_permission`, {
      role_id: role.id,
      permissions: [...permissionsForm],
    });

    if (data) {
      setData(data);
      const _role = data.roles?.find((r) => r.id === role.id);
      setState((state) => ({
        ...state,
        role: _role ? _role : null,
        loading: false,
      }));
    } else {
      setState((state) => ({ ...state, loading: false }));
    }
  }
};
