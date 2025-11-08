import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import * as Yup from "yup";
import { toast } from "sonner";
import { getNote, updateNote, createNote } from "../../services/crud_note";
import {getUserId} from '../../utils/authUtils';
import Loading from "../Loading";
function Create_Note({ onClose, id }) {
  // const navigator = useNavigate();
  // state lưu dữ liệu form
  const [data, setData] = useState({
    title: "",
    content: "",
    summary: "",
    numberQuestion: "",
    file: null,
  });
  const userID = getUserId();
  // console.log(userID);

  const [loading, setLoading] = useState(false); // thêm state loading
  const loginSchema = Yup.object().shape({
    title: Yup.string().required("* Vui lòng nhập tiêu đề"),
    content: Yup.string().when("file", {
      is: (file) => !file, // nếu KHÔNG có file
      then: (schema) =>
        schema
          .min(100, "* Nội dung phải có ít nhất 100 ký tự")
          .required("* Vui lòng nhập nội dung"),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberQuestion: Yup.number().min(10, "* Số câu hình thức phải lớn hơn 1").max(40, "* Số câu hình thức phải nhỏ hơn 40").required("* Vui lòng nhập số câu hình thức"),
    file: Yup.mixed().test("fileType", "* Chỉ chấp nhận file PDF", (value) => {
      return value && value.type === "application/pdf";
    }),
  });
  const validateForm = async () => {
    try {
      await loginSchema.validate(data, { abortEarly: false });
      // setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      // setErrors(newErrors);
      toast.error(Object.values(newErrors).join("\n"));
      return false;
    }
  };
  // hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Nếu là file
    if (files) {
      const selectedFile = files[0];
      if (selectedFile && selectedFile.type !== "application/pdf") {
        toast.error("Chỉ được upload file PDF!");
        return;
      }
      setData((prev) => ({
        ...prev,
        file: selectedFile,
        content: "", // clear content nếu chọn file
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "content" ? { file: null } : {}), // clear file nếu nhập content
      }));
    }
  };
  // nút x thoát
  const handleClose = () => {
    // Reset form data
    setData({
      title: "",
      content: "",
      summary: "",
      numberQuestion: "",
      file: null,
    });
    if (loading) return; // nếu đang loading thì ko đóng
    onClose(); // Gọi hàm onClose từ props để đóng modal
  };

  //hàm submit gửi post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.content && !data.file) {
      toast.error("Bạn phải nhập Content hoặc chọn File PDF!");
      return;
    }
    if (!(await validateForm())) return;
    try {
      setLoading(true);
      const formatdata= new FormData();
      formatdata.append("title", data.title);
      formatdata.append("content", data.content);
      formatdata.append("summary", data.summary);
      formatdata.append("numberQuestion", data.numberQuestion);
      if (data.file) {
        formatdata.append("file_url", data.file);
      }
      if(id){
        const response = await updateNote(formatdata, id);
        if (response.success===true) {
          onClose();
          toast.success("Update note success");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        }else{
          toast.error("Update note failed");
        }
      } else {
        const response = await createNote(userID, formatdata);
        // console.log("response", response);

        if (response.success===true) {
          toast.success(response.message || "Create note success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
            onClose();
        }else{
          toast.error(response.message || "Create note failed");
        }
      }
    } catch (error) {
      console.error(error);
      console.log("error",error.message);
      toast.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };
  // lấy dữ liệu từ id
  useEffect(() => {
    if (id) {
 const fetchNoteID = async () => {
      try {
        const response = await getNote(id);
        setData(response.data);
      } catch {
        // console.error("Error fetching note detail:", e);
        toast.error("Error fetching note detail");
      }
    };
    fetchNoteID();
    }
  }, [id]);
  // console.log('id',id);
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClose}
    >
      <div>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loading />
          </div>
        )}
      </div>
      <div
        className="bg-gray-800 p-6 rounded-lg w-1/3 text-center relative z-10"
        onClick={(e) => e.stopPropagation()} // click trong modal thì ko đóng
      >
        {/* Nút X đẹp từ lucide-react */}
        <p
          onClick={handleClose}
          className="absolute top-1 right-1 p-2 bg-inherit text-gray-500 hover:text-cyan-400"
        >
          <X size={24} /> {/* 👈 icon X */}
        </p>
        <h2
          className="pb-8 text-5xl font-extrabold 
  bg-gradient-to-r from-white via-cyan-300 to-purple-400 
  bg-[length:200%_200%] bg-clip-text text-transparent 
  animate-gradient "
        >
          Create Note
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 max-w-md justify-center items-center mx-auto"
        >
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
            bg-white/10 backdrop-blur-lg 
            border-2 border-x-cyan-400 border-y-cyan-200
            shadow-[0_0_20px_rgba(173,216,230,0.15)]
            transition-all duration-500
            focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
            hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
            animate-floating
            placeholder-cyan-50"
          />

          <textarea
            placeholder="Content (select content is not file and vice versa)"
            name="content"
            rows="4"
            value={data.content}
            onChange={handleChange}
            disabled={!!data.file} // disable nếu có file
            className="p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
            bg-white/10 backdrop-blur-lg 
            border-2 border-x-cyan-400 border-y-cyan-200
            shadow-[0_0_20px_rgba(173,216,230,0.15)]
            transition-all duration-500
            focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
            hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
            animate-floating
            placeholder-cyan-50"
          ></textarea>

          <input
            type="text"
            placeholder="Summary"
            name="summary"
            value={data.summary}
            onChange={handleChange}
            className="p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
            bg-white/10 backdrop-blur-lg 
            border-2 border-x-cyan-400 border-y-cyan-200
            shadow-[0_0_20px_rgba(173,216,230,0.15)]
            transition-all duration-500
            focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
            hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
            animate-floating
            placeholder-cyan-50"
          />
          <input type="number" name="numberQuestion" value={data.numberQuestion} onChange={handleChange} min={10} max={40}
          placeholder="numberQuestion (10-40)"
          className="p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
            bg-white/10 backdrop-blur-lg 
            border-2 border-x-cyan-400 border-y-cyan-200
            shadow-[0_0_20px_rgba(173,216,230,0.15)]
            transition-all duration-500
            focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
            hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
            animate-floating
            placeholder-cyan-50"
           />
          <input
            type="file"
            // accept="application/pdf"
            name="file"
            onChange={handleChange}
            disabled={!!data.content.trim()} // disable nếu có content
            className="p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
            bg-white/10 backdrop-blur-lg 
            border-2 border-x-cyan-400 border-y-cyan-200
            shadow-[0_0_20px_rgba(173,216,230,0.15)]
            transition-all duration-500
            focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
            hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
            animate-floating
            placeholder-cyan-50"
          />

          <button
            type="submit"
            className="bg-black bg-opacity-50 w-1/5 px-3 text-xl text-cyan-200 border-cyan-400 border-2 p-2 rounded hover:bg-opacity-100"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create_Note;
