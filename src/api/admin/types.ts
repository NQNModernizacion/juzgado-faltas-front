export type RoleDto = {
    id: number;
    name: string;
    description: string;
  };
  
  export type PermissionDto = {
    id: number;
    name: string;
    description: string;
  };
  
  export type AdminBootstrapDto = {
    roles: RoleDto[];
    permissions: PermissionDto[];
  };
  
  // ✅ user-by-dni response
  export type PersonaByDniDto = {
    dni: number;
    nombres: string;
    apellidos: string;
    user_id: number;
  };
  
  export type UserAccessDto = {
    id: number;
    email: string;
    roles: string[];        // names
    permissions: string[];  // names
  };
  
  export type UserByDniDto = {
    persona: PersonaByDniDto;
    user: UserAccessDto | null;
  };
  
  // ✅ sync-roles response
  export type SyncUserRolesDto = {
    user_id: number;
    roles: string[];
    permissions: string[];
  };
  
  // ✅ sync-permissions response (tu controller hoy devuelve sólo permissions, pero podés unificar)
  export type SyncUserPermissionsDto = {
    user_id: number;
    permissions: string[];
  };