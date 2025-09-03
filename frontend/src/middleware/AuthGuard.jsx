import { Navigate } from "react-router-dom";
import { getAuthToken, checkTokenValidity } from "../utils/authUtils";
import { checkUserRole } from "./AuthMiddleware";
import { ROLES } from "./role";

const AuthGuard = ({ children }) => {
  const token = getAuthToken();
  
  if (token && checkTokenValidity()) {
    // Nếu là admin, chuyển về dashboard admin
    if (checkUserRole(token, [ROLES.ADMIN])) {
      return <Navigate to="/admin" replace />;
    } else if (checkUserRole(token, [ROLES.USER])) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default AuthGuard; 