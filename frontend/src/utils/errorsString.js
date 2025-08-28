const errorsString = (errors) => {
  if (!errors) return "Đã có lỗi xảy ra"; // fallback

  if (Array.isArray(errors)) {
    // map để lấy message rồi join thành 1 chuỗi
    return errors.map(e => e.message).join(", ");
  } 
  
  if (typeof errors === "object" && errors.message) {
    return errors.message;
  }

  // Trường hợp là string hoặc kiểu khác
  return String(errors);
};

export default errorsString;
