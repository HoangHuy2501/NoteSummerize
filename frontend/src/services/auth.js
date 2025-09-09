import axiosInstance from "../config/axiosConfig";
import { jwtDecode } from 'jwt-decode';
import API_ROUTES from "../config/APIRoutes";
import {
  saveAuthToken,
  removeAuthToken,
  saveUserDataFromToken,
  getUserId
} from "../utils/authUtils";
import errorsString from '../utils/errorsString';
export const loginApi=async (email, password) => {
    try {
        const response = await axiosInstance.post(API_ROUTES.Login, {
            email,
            password,
        });
            const token = response.data.token;
            const mail=response.data.user.email;
            const avatar=response.data.user.image;
            if(token){
                try {
                    saveAuthToken(token);
                    // saveRefreshToken(response.data.refreshToken);
            const decodedToken = jwtDecode(token);
            saveUserDataFromToken(decodedToken, mail, avatar);
                } catch {
                    return {message: "Invalid token"}
                }
            }else{
                return {message: "Invalid token"}
            }
        
        return {
            success: true,
            message: "Đăng nhập thành công",
        }
    } catch(errors) {
        if(errors.response){
             if(errors.response.data.status===404){
            return {
                success: true,
                message: "Tài khoản bạn đã bị khóa",
            }
        }else if (errors.response.data.status===400){
            
            return {
                success: false,
                message: errorsString(errors.response.data.errors),
            }

        }else{
            // console.log(errors.response.data);   
            
            return {
                success: false,
                message:errorsString(errors.response.data.message) || 'Lỗi khi đăng nhập',
            }
        }
    }
        else{
            setTimeout(() => {
                return {
                success: false,
                message:'lỗi chưa kết nối server hoặc mạng không ổn định',
            }
            }, 5000)
            
        }
}};

export const RegisterApi=async (data) => {
    try {
        const response = await axiosInstance.post(API_ROUTES.Register, data);
        return {
            success: true,
            message: errorsString(response.data.data),
        }
    } catch(errors) {
        if(errors.response.data.status===400){
            return {
                success: false,
                message: errorsString(errors.response.data.errors),
            }
        }else{
            return {
                success: false,
                message:errorsString(errors.response.data.message) || 'Lỗi khi đăng ký',
            }
        }
    }
};

export const verifyApi=async (token) => {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.VerifyToken}?token=${token}`);
        return {
            success: true,
            message: errorsString(response.data.message),
        }
    } catch(errors) {
        return {
            success: false,
            status: errors.response.data.status,
            message:errorsString(errors.response.data.message)|| 'Lỗi khi xác thực',
        }
    }
};

export const logout=async () => {
    const userID=getUserId();
    try {
        const response = await axiosInstance.post(`${API_ROUTES.Logout}/${userID}`);
           await removeAuthToken();
        return {
            success: true,
            message: errorsString(response.data.message),
        }
    } catch (error) {
        return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi đăng xuất',
        }
    }

};