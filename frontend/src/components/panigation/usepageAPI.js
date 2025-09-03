import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { useRef, useEffect } from "react";

function get(obj, path, defaultValue = undefined) {
  return path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? defaultValue;
}

export default function usePageApi({
  url,
  page,
  size,
  search,
  orderBy = "created_at",
  orderType = 1,
  refreshKey,
  needTotalCount = true,
  dataPath = "data",
  totalPath = "totalCount",
  additionalParams = {},
}) {
  const queryKey = [
    "pageApi",
    url,
    page,
    size,
    search,
    orderBy,
    orderType,
    refreshKey,
    needTotalCount,
    dataPath,
    totalPath,
    additionalParams.fromDate, // ✅ lọc theo ngày
    additionalParams.toDate,
    additionalParams.transType, // ✅ lọc theo loại chứng từ
    additionalParams.isActive, // ✅ lọc theo trạng thái active
  ];

  const fetchData = async () => {
    // Nếu không có URL hoặc URL rỗng, trả về dữ liệu trống
    if (!url) {
      return {
        data: [],
        total: 0,
      };
    }

    const params = {
      page: page,     // Bỏ qua bao nhiêu mục
      size: size,            // Lấy bao nhiêu mục
      NeedTotalCount: needTotalCount, // Có cần tổng số mục không
      OrderBy: orderBy,    // Sắp xếp theo trường nào
      OrderType: orderType,        // Kiểu sắp xếp
      ...additionalParams,
      // t: Date.now(), // ✅ chống cache
    };
    // Thêm tham số tìm kiếm nếu có
    if (search) {
      params.SearchText = search;
    }
    // Gọi API với các tham số đã tạo
    const token = localStorage.getItem("accessToken");
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axiosInstance.get(url, { params, headers });
    const result = response.data;

    const extractedData = get(result, dataPath, []);
    const extractedTotal = get(result, totalPath, 0);

    return {
      data: Array.isArray(extractedData) ? extractedData : [],
      total: typeof extractedTotal === "number" ? extractedTotal : 0,
    };

  };

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchData,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    // Không gọi API khi URL rỗng
    enabled: !!url,
  });
  const lastTotal = useRef(0);
  useEffect(() => {
    if (data?.total) {
      lastTotal.current = data.total;
    }
  }, [data?.total]);
  return {
    data: data?.data ?? [],
    total: data?.total ?? lastTotal.current,
    loading: isLoading,
    isFetching,
    error,
    refetch,
  };
}