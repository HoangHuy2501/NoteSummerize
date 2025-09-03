import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAuthToken, checkTokenValidity } from "../utils/authUtils";
import { checkUserRole, getUserRole } from "./AuthMiddleware";
import { setupTokenRefresher } from "../services/tokenRefresher";
import { ROLES } from "./role";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const accessToken = getAuthToken();
  const location = useLocation();
  const currentPath = location.pathname;

  // Khởi tạo tokenRefresher khi có access token hợp lệ
  useEffect(() => {
    if (accessToken) {
      // Kiểm tra xem access token còn hợp lệ không
      if (checkTokenValidity()) {
        setupTokenRefresher();
      } else {
        console.log('ProtectedRoute: Access token đã hết hạn, cần đăng nhập lại');
      }
    }
  }, [accessToken]);

  // Kiểm tra xem có access token không
  if (!accessToken) {
    console.log('ProtectedRoute: Không có access token - cần đăng nhập');
    
    // Redirect về trang login phù hợp
    // if (allowedRoles.includes(ROLES.ADMIN)) {
    //   return <Navigate to="/loginAdmin" replace />;
    // }
    return <Navigate to="/auth/login" replace />;
  }

  // Kiểm tra access token còn hợp lệ không (đã hết hạn)
  if (!checkTokenValidity()) {
    console.log('ProtectedRoute: Access token đã hết hạn, cần đăng nhập lại');
    
    // Redirect về trang login phù hợp
                    // if (allowedRoles.includes(ROLES.ADMIN)) {
                    //   return <Navigate to="/loginAdmin" replace />;
                    // }
    return <Navigate to="/auth/login" replace />;
  }

  // Kiểm tra quyền truy cập
  const isAllowed = checkUserRole(accessToken, allowedRoles);
  
  if (!isAllowed) {
    console.log('ProtectedRoute: User không có quyền truy cập');
    console.log('User role:', getUserRole());
    return <Navigate to="/auth/login" replace />;
  }

  // Kiểm tra và điều hướng dựa trên role và path
  const protectedPaths = ['/', '/admin'];
  if (protectedPaths.includes(currentPath)) {
    // Kiểm tra role của user
    const isAdmin = checkUserRole(accessToken, [ROLES.ADMIN]);
    const isAccountant = checkUserRole(accessToken, [ROLES.USER]);

    // Nếu là admin, chuyển về trang admin
    if (isAdmin && currentPath !== '/admin') {
      console.log('ProtectedRoute: Admin đang truy cập /qua hoặc /bakery hoặc /accountant - chuyển hướng đến /admin');
      return <Navigate to="/admin" replace />;
    }

    // Nếu là accountant truy cập /admin, chuyển về /accountant
    if (isAccountant && currentPath === '/admin') {
      console.log('ProtectedRoute: Accountant đang truy cập /admin - chuyển hướng đến /');
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
