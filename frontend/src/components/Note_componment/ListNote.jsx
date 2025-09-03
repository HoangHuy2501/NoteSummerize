import React, {  useState } from 'react';
import { useNavigate } from "react-router-dom";
import fmtDate from '../../utils/fmtDate';
import Panigation from '../panigation/Panigation';
import {Trash2} from 'lucide-react'
import usePageApi from '../../components/panigation/usepageAPI.js';
import {getUserId} from '../../utils/authUtils.js';
import { deleteNote } from '../../services/crud_note.js';
import ConfirmDeleteModal from './ComfirDelete.jsx';
import { toast } from 'sonner';


function ListNote({ search }) {
  //   const filtered = [
  //   { id: "n1", title: "Linear Algebra – Lecture 1", created_at: "2025-08-19T10:12:00Z" },
  //   { id: "n2", title: "Computer Networks – TCP/IP", created_at: "2025-08-18T15:22:00Z" },
  //   { id: "n3", title: "Biology – Photosynthesis", created_at: "2025-08-16T11:05:00Z" },
  // ];
  // console.log("hihi",search);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pagination, setPagination] = useState({
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });
  const userid = getUserId();
  // call api phân trang
  const {
    data,
    total,
    // isFetching,
    // refetch,
  } = usePageApi({
    url: `/notes/list/${userid}`, 
    page: current,
    size: pagination.pageSize,
    // search: searchText,
    dataPath: "data.data",   // <-- list
  totalPath: "data.total", // <-- tổng số
  });
  // console.log('Data fetched:', data);

   const handleDelete = async(id) => {
    try {
      const response = await deleteNote(id);
      if (response.success) {
        window.location.reload();
        toast.success("Delete note success");
      }
    } catch {
      toast.error("Delete note failed");
    }
  };
  // lấy dữ liệu list note

  const handleOpen = (id) => {
    navigate(`/notes/${id}`);
  };
    return (
        <div>
            <ConfirmDeleteModal
                open={openDelete}
                onOk={() => handleDelete(idDelete)}
                onCancel={() => setOpenDelete(false)}
            />
            <ul className=" rounded-2xl bg-inherit shadow-sm">
    <h2 className="text-lg mb-3 font-semibold text-cyan-200">List({total})</h2>
        {data.map((n) => (
          <li key={n.id} className="p-4 border-b border-cyan-300 flex items-center justify-between">
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-gray-500">
                {/* {new Date(n.created_at).toLocaleString()} */}
                {fmtDate(n.created_at)}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpen(n.id)}
                className="text-sm bg-inherit px-3 py-2 rounded-lg border hover:bg-inherit hover:text-cyan-200 hover:border-cyan-400"
              >
                View Details
              </button>
              <button
                onClick={() => { setOpenDelete(true); setIdDelete(n.id); }}
                className="text-sm px-3 py-2 rounded-lg border text-red-600 hover:bg-cyan-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Panigation currentPage={current} totalPages={Math.ceil(total / pagination.pageSize)} onPageChange={(page) => setCurrent(page)} />
        </div>
    );
}

export default ListNote;