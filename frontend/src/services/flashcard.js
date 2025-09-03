import axiosInstance from "../config/axiosConfig";
import API_ROUTES from "../config/APIRoutes";
// import {
//   getUserId
// } from "../utils/authUtils";
import errorsString from '../utils/errorsString';

// const userID=getUserId();
export const getLatestFlashcard = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_ROUTES.GetLatestFlashcard}/${id}`);
    return {
            success: true,
            data: response.data,
        };
  } catch (error) {
    return {
            success: false,
            message: errorsString(error.response.data.message) || 'Lỗi khi lấy flashcard',
        };
  }
};
