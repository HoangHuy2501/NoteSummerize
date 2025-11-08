import axiosInstance from "../config/axiosConfig";
import API_ROUTES from "../config/APIRoutes";
import errorsString from '../utils/errorsString';

export const getInformationPoint = async (note_id) => {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.GetInformationPoint}/${note_id}`);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi lấy thông tin điểm thông tin',
        };
    }
}