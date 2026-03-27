import React from "react";
import Tooltip from "../../components/Tooltip";

import { Card, CheckboxBase /*, Badge*/ } from "muni-ui";

type Role = {
  id: number;
  description: string;
};

type Permission = {
  id: number;
  description: string;
  checked: boolean;
  disabled?: boolean;
  roles?: Role[];
};

type PermissionsGroup = {
  [key: string]: Permission[];
};

type CardAdminProps = {
  grupos: string[];
  permissions_groups: PermissionsGroup;
  role?: boolean;
  loading: boolean;
  changeCheckPermission: (
    e: Permission,
    permissionsForm: any,
    setPermissionsForm: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  permissionsForm: any;
  setPermissionsForm: React.Dispatch<React.SetStateAction<any>>;
};

const CardAdmin: React.FC<CardAdminProps> = ({
  grupos,
  permissions_groups,
  role = true,
  loading,
  changeCheckPermission,
  permissionsForm,
  setPermissionsForm,
}) => {
  return (
    <div className="mx-auto w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grupos?.map((g, index) => {
          const count = permissions_groups?.[g]?.length ?? 0;

          return (
            <Card key={`${g}_${index}`} className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-border bg-primary/10 px-4 py-3">
                <div className="text-base font-semibold text-primary-800">{g}</div>

            
                <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs font-semibold text-primary-900">
                  {count}
                </span>

              
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex flex-col gap-3">
                  {permissions_groups?.[g]?.map((e, key) => {
                    const disabled = !role || e.disabled || loading;

                    const labelNode = (
                      <label
                        htmlFor={String(e.id)}
                        className={[
                          "select-none text-sm font-medium",
                          disabled
                            ? "cursor-not-allowed text-muted"
                            : "cursor-pointer text-text hover:text-primary-800",
                        ].join(" ")}
                      >
                        {e.description}
                      </label>
                    );

                    return (
                      <div
                        key={key}
                        className={[
                          "flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors",
                          disabled ? "opacity-60" : "hover:bg-primary/5",
                        ].join(" ")}
                      >
                        <div className="pt-0.5">
                          <CheckboxBase
                            id={String(e.id)}
                            checked={!!e.checked}
                            disabled={disabled}
                            onCheckedChange={() =>
                              changeCheckPermission(e, permissionsForm, setPermissionsForm)
                            }
                          />
                        </div>

                        {e.roles?.length ? (
                          <Tooltip
                            disabled={disabled}
                            text={
                              <div>
                                <h6 className="font-semibold text-text">
                                  Incluido en los roles:
                                </h6>
                                <ul className="list-disc pl-4 text-sm text-text">
                                  {e.roles.map((r) => (
                                    <li key={r.id}>{r.description}</li>
                                  ))}
                                </ul>
                              </div>
                            }
                          >
                            {labelNode}
                          </Tooltip>
                        ) : (
                          labelNode
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardAdmin;
