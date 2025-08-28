import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RegisterApi } from "../../services/auth";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import * as Yup from "yup";
Register.propTypes = {};

function Register() {
  const [format, setFormat] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
    const [loading, setLoading] = useState(false); // thêm state loading
      const loginSchema = Yup.object().shape({
    email: Yup.string().required("* Vui lòng nhập email").email("* Vui lòng nhập email hợp lý"),
    password: Yup.string()
      .required("* Vui lòng nhập mật khẩu")
      .min(6, "* Mật khẩu phải có ít nhất 6 ký tự").max(20, "* Mật khẩu phải nhỏ hơn 20 ký tự"),
  });
    const validateForm = async () => {
    try {
      await loginSchema.validate(format, { abortEarly: false });
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
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormat({
        ...format,
        [e.target.name]: e.target.files[0], // lấy file đầu tiên
      });
    } else {
      setFormat({
        ...format,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleClick=async(e)=>{
    e.preventDefault();
    if(! await validateForm()) return
try {
    const data=new FormData();
    data.append("name",format.name);
    data.append("email",format.email);
    data.append("password",format.password);
    data.append("image",format.image);
  setLoading(true);
      const res=await RegisterApi(data);
    if(res.success===true){
      toast.success(res.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }else{
      toast.error(res.message);
    }
} catch {
  toast.error("Có lỗi xảy ra!");
}finally{
  setLoading(false);
}
  }
  return (
    <div>
      <div>
        {loading ===true &&
          <Loading />
        }
      </div>
          <div className="relative z-10">
      <h1
        className="pb-8 text-5xl font-extrabold 
  bg-gradient-to-r from-white via-cyan-300 to-purple-400 
  bg-[length:200%_200%] bg-clip-text text-transparent 
  animate-gradient"
      >
        Register
      </h1>
      <h2 className=" text-gray-400 capitalize">
        chào mừng bạn đến với
        <span
          className="ml-2 font-extrabold bg-gradient-to-r from-white via-gray-200
              to-white bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        >
          AI NOTES SUMMARIZED
        </span>
      </h2>
      <form onSubmit={handleClick}>
        <div className="flex flex-col gap-8 mt-6 ">
          <div className="w-full flex justify-between ">
            <label className="text-cyan-200 mt-1">Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={format.name}
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
          </div>

          <div className="w-full flex justify-between ">
            <label className="text-cyan-200 mt-1">Email:</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={format.email}
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
          </div>
          <div className="w-full flex justify-between ">
            <label className="text-cyan-200 mt-1">Password:</label>
            <input
              type="password"
              value={format.password}
              name="password"
              placeholder="Password"
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
          </div>
          <div className="w-full flex justify-between items-center">
            <label className="text-cyan-200 mt-1">Image:</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="file:p-2 file:mr-4 file:rounded-md file:border-0 
           file:bg-cyan-400/20 file:text-cyan-200 file:font-semibold
           file:hover:bg-cyan-400/30 file:hover:text-white
           p-2 w-2/3 max-w-xs rounded-xl text-cyan-300 placeholder-gray-300
           bg-white/10 backdrop-blur-lg 
           border-2 border-x-cyan-400 border-y-cyan-200
           shadow-[0_0_20px_rgba(173,216,230,0.15)]
           transition-all duration-500
           focus:(border-cyan-300 shadow-[0_0_30px_rgba(173,216,230,0.6)])
           hover:(border-cyan-500 shadow-[0_0_25px_rgba(173,216,230,0.4)])
           animate-floating"
            />
          </div>
        </div>
        <button type="submit"
          className="btn mt-10 bg-gray-950 max-w-xs border border-cyan-400 font-extrabold 
  bg-gradient-to-r from-white via-cyan-300 to-purple-400 
  bg-[length:200%_200%] bg-clip-text text-transparent 
  animate-gradient "
        >
          Register
        </button>
      </form>
      <div>
        <p className="mt-4">
          Already have an account? <NavLink to="/auth/login">Login</NavLink>
        </p>
      </div>
    </div>
    </div>

  );
}

export default Register;
