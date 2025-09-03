/**
 * Middleware xác thực và phân quyền người dùng
 * - Kiểm tra token xác thực
 * - Kiểm tra vai trò (role) của người dùng
 * - Cho phép hoặc từ chối truy cập dựa vào vai trò
 */

import { Navigate } from "react-router-dom";
import { getAuthToken } from "../utils/authUtils";
import { jwtDecode } from "jwt-decode";



/**
 * Kiểm tra xem người dùng có vai trò được yêu cầu hay không dựa trên token JWT
 */
export const checkUserRole = (token, requiredRoles) => {
  if (!token) {
    console.log('No token provided');
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    // Lấy vai trò người dùng từ token (kiểm tra nhiều cấu trúc token khác nhau)
    let userRole = null;

    // Cấu trúc 1: Chuẩn Microsoft Claims
    if (decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
      userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    }
    // Cấu trúc 2: Trường role thông thường
    else if (decodedToken.role) {
      userRole = decodedToken.role;

    }
    // Cấu trúc 3: Trường roles (mảng vai trò)
    else if (decodedToken.roles) {
      userRole = decodedToken.roles;

    }

    // Chuyển requiredRoles thành mảng nếu là chuỗi đơn
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];


    // Nếu userRole là mảng, kiểm tra xem có vai trò nào khớp không
    if (Array.isArray(userRole)) {
      const hasRole = userRole.some((role) => rolesArray.includes(role));
      console.log('Array role check result:', hasRole);
      return hasRole;
    }

    // Nếu userRole là chuỗi, kiểm tra xem có trong mảng rolesArray không
    const hasRole = rolesArray.includes(userRole);
    return hasRole;
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
};

/**
 * Higher-order component kiểm tra quyền người dùng
 * @param {Array<string>} allowedRoles - Danh sách các vai trò được phép truy cập
 * @returns Component gốc nếu người dùng có quyền, ngược lại chuyển hướng đến trang không có quyền
 */


/**
 * Kiểm tra xem người dùng có vai trò cụ thể hay không
 * @param {string} roleToCheck - Vai trò cần kiểm tra
 * @returns {boolean} true nếu người dùng có vai trò, ngược lại false
 */
export const hasRole = (roleToCheck) => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole =
      decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    // Nếu userRole là mảng, kiểm tra xem roleToCheck có tồn tại trong mảng
    if (Array.isArray(userRole)) {
      return userRole.includes(roleToCheck);
    }

    // Nếu userRole là chuỗi, so sánh trực tiếp
    return userRole === roleToCheck;
  } catch (error) {
    console.error("Role validation error:", error);
    return false;
  }
};

/**
 * Lấy vai trò của người dùng hiện tại
 * @returns {string|Array<string>|null} Vai trò của người dùng hoặc null nếu chưa đăng nhập
 */
export const getUserRole = () => {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  } catch (error) {
    console.error("Get user role error:", error);
    return null;
  }
};
