
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ROUTES = {
  // Authentication & User Routes
  Register: "auth/register", // hàm đăng ký [POST]
  Login: "auth/login", // hàm login [POST]
  VerifyToken: "/auth/verify", // hàm verify token [GET] ('kèm theo token vd: /verify?token=token)
  // Note Routes
  CreateNote: "notes/id", // hàm tạo note [POST] id của người dùng 
  UpdateNote: "notes/id", // hàm cập nhập note [PUT] id của note muốn cập nhập 
  DeleteNote: "notes/id", // hàm tạo note [DELETE] id của note muốn xóa
  GetNote: "notes/id", // hàm lấy note [GET] id của note muốn lấy
  GetAllNotes: "notes/list/id", // hàm lấy tất cả note [GET] id của người dùng
};

export default API_ROUTES;