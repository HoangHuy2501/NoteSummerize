import axiosInstance from "../config/axiosConfig";
import API_ROUTES from "../config/APIRoutes";
import errorsString from '../utils/errorsString';


export const createNote = async (userID, data) => {
    try {
        const response = await axiosInstance.post(`${API_ROUTES.CreateNote}/${userID}`, data);
        return {
            success: true,
            message: errorsString(response.data.message),
        }
    } catch (error) {
        return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi tạo ghi chú',
        }
    }
}
export const updateNote=async(data, id)=>{
    try {
        const response = await axiosInstance.put(`${API_ROUTES.UpdateNote}/${id}`, data);
        return {
            success: true,
            message: errorsString(response.data.message),
        }
    } catch (error) {
        return{
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi cập nhật ghi chú',
        }
    }
}

export const deleteNote=async (id)=>{
    try {
        const response = await axiosInstance.delete(`${API_ROUTES.DeleteNote}/${id}`);
        return {
            success: true,
            message: errorsString(response.data.message),
        }
    } catch (error) {
        return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi xóa ghi chú',
        }
    }
}

export const getNote=async (id)=>{
    try {
        const response = await axiosInstance.get(`${API_ROUTES.GetNote}/${id}`);
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        return {
            success: false, 
            message: errorsString(error.response.data.message) || 'Lỗi khi lấy ghi chú',
        }
    }
}
// lấy 5 note gần nhất
export const getRecentNotes=async(id)=>{
    try {
        const response = await axiosInstance.get(`${API_ROUTES.GetRecentNote}/${id}`);
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi lấy ghi chú gần đây',
        }
    }
}
