import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { PERMISSIONS } from "../config/permissions";

export const usePermission = (permissionKey) => {
  const { user } = useContext(UserContext);
  if (!user) return false;
  const allowedRoles = PERMISSIONS[permissionKey] || [];
  return allowedRoles.includes(user.role);
};