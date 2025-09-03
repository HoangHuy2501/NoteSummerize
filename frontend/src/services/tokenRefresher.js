/**
 * Service quản lý việc tự động làm mới token
 * - Tự động refresh token trước khi hết hạn 110 giây
 * - Chỉ gọi 1 lần duy nhất khi cần thiết
 * - Đảm bảo phiên đăng nhập được duy trì liên tục
 */
import axiosInstance from '../config/axiosConfig';
import { getAuthToken, saveAuthToken, checkTokenValidity,getRefreshToken } from '../utils/authUtils';
import { jwtDecode } from 'jwt-decode';
import API_ROUTES from '../config/APIRoutes';

// Thời gian trước khi hết hạn để refresh token (110 giây)
const REFRESH_BEFORE_EXPIRY = 100 * 1000; // 110 giây = 110 * 1000 ms

// Lưu trữ ID của timeout để có thể xóa khi cần
let refreshTimeoutId = null;

// Lưu trữ trạng thái tab
let isTabActive = true;

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Xử lý khi tab được active/inactive
const handleVisibilityChange = () => {
   isTabActive = !document.hidden;

   if (isTabActive) {
      setupTokenRefresher();
   } else {
      stopTokenRefresher();
   }
};

// Xử lý trước khi tab đóng
const handleBeforeUnload = () => {
   stopTokenRefresher();
};

// Thêm subscriber cho quá trình refresh token
const addRefreshSubscriber = (callback) => {
   refreshSubscribers.push(callback);
};

// Thông báo cho tất cả subscribers khi refresh token hoàn tất
const notifyRefreshSubscribers = (token) => {
   refreshSubscribers.forEach((callback) => callback(token));
   refreshSubscribers = [];
};

// Kiểm tra và thiết lập làm mới token nếu người dùng đã đăng nhập
export const setupTokenRefresher = () => {
   const token = getAuthToken();

   // Kiểm tra có access token và còn hợp lệ không
   if (token && checkTokenValidity()) {
      try {
         // Kiểm tra token có hợp lệ không
         const decoded = jwtDecode(token);
         const currentTime = Date.now() / 1000;

         // Nếu token còn hạn, bắt đầu quá trình làm mới
         if (decoded && decoded.exp && decoded.exp > currentTime) {
            startTokenRefresher();

            // Đăng ký các event listeners
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', handleBeforeUnload);
         }
      } catch (error) {
         console.error('Lỗi khi setup token refresher:', error);
      }
   }
};

// Bắt đầu quá trình tự động làm mới token
export const startTokenRefresher = () => {
   // Nếu đã có timeout đang chạy, dừng lại trước
   if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
   }

   const token = getAuthToken();

   // Kiểm tra access token
   if (!token || !checkTokenValidity()) {
      console.log('Không có access token hợp lệ để setup auto refresh');
      return;
   }

   try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiryTime = decoded.exp;

      // Tính thời gian còn lại đến khi hết hạn (tính bằng milliseconds)
      const timeUntilExpiry = (expiryTime - currentTime) * 1000;

      // Tính thời gian để refresh (trước khi hết hạn 110 giây)
      const timeUntilRefresh = timeUntilExpiry - REFRESH_BEFORE_EXPIRY;

      if (timeUntilRefresh > 0) {
         // Thiết lập timeout để refresh token trước khi hết hạn
         refreshTimeoutId = setTimeout(() => {
            if (isTabActive) {
               refreshToken();
            }
         }, timeUntilRefresh);
      } else {
         // Token sắp hết hạn, refresh ngay
         if (isTabActive) {
            refreshToken();
         }
      }
   } catch (error) {
      console.error('Lỗi khi start token refresher:', error);
   }
};

// Dừng quá trình tự động làm mới token
export const stopTokenRefresher = () => {
   if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
   }

   // Hủy đăng ký các event listeners
   document.removeEventListener('visibilitychange', handleVisibilityChange);
   window.removeEventListener('beforeunload', handleBeforeUnload);
};

// Làm mới token
export const refreshToken = async () => {
   try {
      // Nếu đang refresh token, đợi kết quả
      if (isRefreshing) {
         return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
               resolve({ success: true, accessToken: token });
            });
         });
      }

      isRefreshing = true;

      // Lấy access token hiện tại
      const currentToken = getRefreshToken();
      if (!currentToken) {
         isRefreshing = false;
         return { success: false, message: 'Không tìm thấy access token' };
      }

      // Gọi API làm mới token với access token hiện tại
      const response = await axiosInstance.post(API_ROUTES.refreshToken, {
         token: currentToken
      });

      // Xử lý kết quả
      const { accessToken, expiresIn } = response.data;
      if (accessToken) {
         // Lưu token mới
         saveAuthToken(accessToken);

         // Thông báo cho các subscribers
         notifyRefreshSubscribers(accessToken);

         // Thiết lập lại auto-refresh cho token mới
         startTokenRefresher();

         isRefreshing = false;
         return {
            success: true,
            accessToken,
            expiresIn
         };
      }

      isRefreshing = false;
      return { success: false, message: 'Không nhận được token mới' };
   } catch (error) {
      isRefreshing = false;

      console.error('TokenRefresher: Refresh token thất bại:', error);

      // Nếu lỗi 401 (token không hợp lệ), dừng quá trình làm mới token
      if (error.response && error.response.status === 401) {
         stopTokenRefresher();
      }

      return {
         success: false,
         message: error.response?.data?.message || 'Lỗi khi làm mới token'
      };
   }
};

export default {
   refreshToken,
   startTokenRefresher,
   stopTokenRefresher,
   setupTokenRefresher
}; 