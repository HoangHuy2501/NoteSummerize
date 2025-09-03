import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkTokenValidity, removeAuthToken, getAuthToken } from '../../utils/authUtils';
import { stopTokenRefresher, refreshToken } from '../../services/tokenRefresher';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

// Các route công khai không cần kiểm tra token
const PUBLIC_ROUTES = ['/auth/login', '/auth/loginadmin', '/unauthorized', '/auth/', '/server-error', '/disconnected', '/not-found', '/auth/register', '/verify'];

const TokenValidator = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeAuthToken();
    stopTokenRefresher();
    toast.error('Phiên đăng nhập đã hết hạn! Đang tự động đăng xuất...', {
      duration: 4000,
    });
    setTimeout(() => {
      navigate('/auth/login');
    }, 2000);
  };

  const performTokenValidation = async () => {
    // Bỏ qua kiểm tra cho các route công khai
    if (PUBLIC_ROUTES.includes(location.pathname)) {
      return;
    }

    const accessToken = getAuthToken();
    
    // Kiểm tra có access token không
    if (!accessToken) {
      return;
    }
    // Kiểm tra access token còn hợp lệ không (tự động xóa nếu hết hạn)
    if (!checkTokenValidity()) {

      handleLogout();
      return;
    }

    try {
      // Decode access token để kiểm tra thời gian hết hạn
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decodedToken.exp - currentTime;

      // Nếu access token sắp hết hạn (còn 2 phút) - thử refresh
      if (timeUntilExpiry <= 120) {
        try {
          // Thử refresh token
          const refreshResult = await refreshToken();
          
          if (refreshResult.success) {
            console.log('TokenValidator: Refresh token thành công');
            // Token đã được tự động lưu trong hàm refreshToken
            return;
          } else {
            console.error('TokenValidator: Refresh token thất bại:', refreshResult.message);
            
            // Refresh thất bại - logout
            toast.error('Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại!', {
              duration: 4000,
            });
            
            handleLogout();
          }
        } catch {
          handleLogout();
          return;
        }
      } else {
        console.log( Math.round(timeUntilExpiry), 'giây');
      }

    } catch (error) {
      console.error(error);
      handleLogout();
    }
  };

  useEffect(() => {
    // Kiểm tra token khi component mount hoặc khi route thay đổi
    performTokenValidation();

    // Thiết lập interval để kiểm tra token định kỳ (mỗi phút)
    const intervalId = setInterval(() => {
     
      performTokenValidation();
    }, 60000);

    // Cleanup interval khi component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  return children;
};

export default TokenValidator; 