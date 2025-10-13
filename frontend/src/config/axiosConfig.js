import axios from 'axios';
import { toast } from 'sonner';
import { getAuthToken, removeAuthToken } from '../utils/authUtils';
import { refreshToken } from '../services/tokenRefresher';

// Lấy BASE_URL từ biến môi trường hoặc dùng URL dev
const BASE_URL = import.meta.env.VITE_HTTP_API;

// Biến để theo dõi trạng thái refresh token
let isRefreshingToken = false;
let failedQueue = [];

// Xử lý các request đang chờ
const processQueue = (error, token = null) => {
   failedQueue.forEach(prom => {
      if (error) {
         prom.reject(error);
      } else {
         prom.resolve(token);
      }
   });
   failedQueue = [];
};

// Hàm xử lý logout và thông báo
const handleSessionExpired = (message = 'Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.') => {
   removeAuthToken();
   // Dừng tất cả các request đang chờ
   processQueue(new Error('Session expired'), null);
   // Hiển thị thông báo
   toast.error(message, {
      duration: 4000,
   });
   // Redirect sau 1 giây để đảm bảo user thấy thông báo
   setTimeout(() => {
      window.location.href = '/auth/login';
   }, 1000);
};

const axiosInstance = axios.create({
   baseURL: BASE_URL,
   timeout: 260000,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor
axiosInstance.interceptors.request.use(
   (config) => {
      const token = getAuthToken();
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      // Xử lý FormData
      if (config.data instanceof FormData) {
         delete config.headers['Content-Type'];
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Response interceptor
axiosInstance.interceptors.response.use(
   (response) => {
      return response;
   },
   async (error) => {
      const originalRequest = error.config;

      // Kiểm tra response từ server
      const errorResponse = error.response?.data;

      // Kiểm tra nếu là lỗi 401 và chưa thử refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {

         // Kiểm tra các trường hợp refresh token hết hạn
         if (originalRequest.url === '/auth/check/refresh-token' ||
            errorResponse?.message?.toLowerCase().includes('refresh token expired') ||
            errorResponse?.message?.toLowerCase().includes('invalid refresh token')) {

            console.log('🔒 Refresh token đã hết hạn:', errorResponse?.message);
            handleSessionExpired('Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.');
            return Promise.reject(error);
         }

         if (isRefreshingToken) {
            // Nếu đang refresh token, thêm request vào queue
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            })
               .then(token => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return axiosInstance(originalRequest);
               })
               .catch(err => {
                  return Promise.reject(err);
               });
         }

         originalRequest._retry = true;
         isRefreshingToken = true;

         try {
            // Thử refresh token
            const result = await refreshToken();
            if (result.success) {
               const { accessToken } = result;
               // Cập nhật token cho request hiện tại
               originalRequest.headers.Authorization = `Bearer ${accessToken}`;
               // Xử lý các request đang chờ
               processQueue(null, accessToken);
               return axiosInstance(originalRequest);
            } else {
               // Refresh token thất bại
               console.log('❌ Refresh token thất bại:', result.message);
               handleSessionExpired('Phiên đăng nhập không hợp lệ! Vui lòng đăng nhập lại.');
               return Promise.reject(error);
            }
         } catch (refreshError) {
            console.error('❌ Lỗi khi refresh token:', refreshError);
            handleSessionExpired('Không thể làm mới phiên đăng nhập! Vui lòng đăng nhập lại.');
            return Promise.reject(refreshError);
         } finally {
            isRefreshingToken = false;
         }
      }

      // Xử lý các lỗi khác
      if (error.response?.status === 403) {
         toast.error('Bạn không có quyền thực hiện thao tác này!', {
            duration: 3000,
         });
      }

      return Promise.reject(error);
   }
);

export default axiosInstance;
