import { useState, useEffect } from 'react';

/**
 * Hook trì hoãn cập nhật giá trị để tránh gọi API quá nhiều lần
 * @param {any} value - Giá trị cần trì hoãn
 * @param {number} delay - Thời gian trì hoãn (ms)
 * @returns {any} - Giá trị sau khi đã trì hoãn
 */
export function useDebounce(value, delay) {
   const [debouncedValue, setDebouncedValue] = useState(value);

   useEffect(() => {
      // Đặt một timeout để cập nhật giá trị sau khoảng thời gian delay
      const timer = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      // Xóa timeout nếu giá trị thay đổi hoặc component unmount
      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return debouncedValue;
} 