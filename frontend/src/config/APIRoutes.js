
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ROUTES = {
  // Authentication & User Routes
  Register: "auth/register", // hàm đăng ký [POST]
  Login: "auth/login", // hàm login [POST]
  VerifyToken: "/auth/verify", // hàm verify token [GET] ('kèm theo token vd: /verify?token=token)
  refreshToken: "/auth/check/refresh-token", // hàm refresh token [POST]
  Logout: "/auth/logout", // hàm logout [POST]
  // Note Routes
  CreateNote: "/notes", // hàm tạo note [POST] id của người dùng 
  UpdateNote: "/notes", // hàm cập nhập note [PUT] id của note muốn cập nhập 
  DeleteNote: "/notes", // hàm tạo note [DELETE] id của note muốn xóa
  GetNote: "/notes", // hàm lấy note [GET] id của note muốn lấy
  GetAllNotes: "/notes/list", // hàm lấy tất cả note [GET] id của người dùng
  GetRecentNote: "/notes/recent", // hàm lấy 5 note gần đây [GET] id người dùng
  // flashcards
  GetLatestFlashcard: "/flashcards/latest", // hàm lấy flashcard mới nhất [GET] id người dùng
};

export default API_ROUTES;