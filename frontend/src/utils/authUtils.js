/**
 * Các tiện ích xử lý xác thực và quản lý token
 * File này chứa các hàm để quản lý token, xác thực người dùng và thông tin người dùng
 */

import { jwtDecode } from 'jwt-decode';

// Các khóa lưu trữ trong localStorage/sessionStorage
const TOKEN_KEY = 'accessToken';
const USER_NAME_KEY = 'user_name';
const USER_EMAIL_KEY = 'user_email';
const USER_ID_KEY = 'userId';
const USER_IMAGE='image';
const ROLE='role';

// Lưu access token vào localStorage 
export const saveAuthToken = (token) => {
   localStorage.setItem(TOKEN_KEY, token);
   return token;
};
// lưu refreshtoken vào localStorage
// export const saveRefreshToken = (refreshToken) => {
//    localStorage.setItem('refreshToken', refreshToken);
//    return refreshToken;
// };

// Lấy token đăng nhập từ localStorage
export const getAuthToken = () => {
   return localStorage.getItem(TOKEN_KEY);
};
export const getRefreshToken = () => {
   return localStorage.getItem('refreshToken');
};

// Kiểm tra người dùng đã đăng nhập hay chưa
// true nếu đã đăng nhập, false nếu chưa
export const isAuthenticated = () => {
   return !!getAuthToken();
};


// Xóa token và thông tin người dùng khi đăng xuất hoặc token hết hạn
// Hàm này xóa dữ liệu từ cả localStorage 

export const removeAuthToken = () => {
   localStorage.removeItem(TOKEN_KEY);
   localStorage.removeItem(USER_NAME_KEY);
   localStorage.removeItem(USER_EMAIL_KEY);
   localStorage.removeItem(USER_ID_KEY);
   localStorage.removeItem(USER_IMAGE);
};


// Lưu thông tin người dùng từ JWT token đã được giải mã
// Token JWT đã được giải mã
// Thông tin đã lưu hoặc null nếu có lỗi

export const saveUserDataFromToken = (decodedToken, mail, avatar) => {
   try {
      const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decodedToken.name;
      const email = mail;
      const userId = decodedToken.userId;
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;
      const image = avatar;
    //   const storeId = decodedToken.StoreId;
      if (userId) {
         localStorage.setItem(USER_ID_KEY, userId);
      }
    if(image){
      localStorage.setItem(USER_IMAGE, image);
    }
      if (name) {
         localStorage.setItem(USER_NAME_KEY, name);
      }

      if (email) {
         localStorage.setItem(USER_EMAIL_KEY, email);
      }
      if(role){
        localStorage.setItem(ROLE,role);
      }
      return { name, userId,  role, email, image };
   } catch (error) {
      console.error("Lỗi khi lưu thông tin người dùng từ token:", error);
      return null;
   }
};
export const getUserId = () => {
   return localStorage.getItem(USER_ID_KEY);
};

// export const getStoreId = () => {
//    return localStorage.getItem("storeId");
// };
export const getUserImage = () => {
   return localStorage.getItem(USER_IMAGE);
}
/**
 * Lấy tên người dùng từ localStorage
 * @returns {string|null} Tên người dùng hoặc null nếu không tồn tại
 */
export const getUserName = () => {
   return localStorage.getItem(USER_NAME_KEY);
};

export const getUserRole=()=>{
   return localStorage.getItem(ROLE);
};
/**
 * Lấy email người dùng từ localStorage
 * @returns {string|null} Email người dùng hoặc null nếu không tồn tại
 */
export const getUserEmail = () => {
   return localStorage.getItem(USER_EMAIL_KEY);
};

/**
 * Kiểm tra tính hợp lệ của token
 * @returns {boolean} true nếu token hợp lệ và chưa hết hạn, false nếu ngược lại
 */
export const checkTokenValidity = () => {
   const token = getAuthToken();

   if (!token) {
      return false;
   }

   try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Kiểm tra xem token đã hết hạn chưa
      if (decodedToken.exp < currentTime) {
         // Token đã hết hạn, xóa token và trả về false
         removeAuthToken();
         return false;
      }

      return true;
   } catch (error) {
      // Nếu token không hợp lệ hoặc không thể decode
      console.error("Token không hợp lệ:", error);
      removeAuthToken();
      return false;
   }
}; 