import axiosInstance from "../config/axiosConfig";
import API_ROUTES from "../config/APIRoutes";
import errorsString from '../utils/errorsString';

export const checkPoint = async (note_id) => {
  try {
    const response = await axiosInstance.put(`${API_ROUTES.checkAswer}/${note_id}`);
    return {
            success: true,
            data: response.data,
        }
  } catch (error) {
    return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi lấy điem',
        }
  }
};