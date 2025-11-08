import React, { useEffect, useState } from "react";
import { Card, Tag, Typography, Button,Space } from "antd";
import fmtDate from "../../utils/fmtDate";
import { useNavigate, useParams } from "react-router-dom";
import UpdateNote from "./Create_update_Note";
import {getNote, deleteNote} from '../../services/crud_note'
import { toast } from "sonner";
import ConfirmDeleteModal from "./ComfirDelete"
import Back from "../Back";

const { Text } = Typography;

function NoteDetail() {
    const navigate = useNavigate();
    const [update,setUpdate]=useState(false);
    const [note, setNote] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
  // 🔹 dữ liệu mẫu
  // const note = {
  //   id: "NT-001",
  //   title: "Họp dự án tháng 8",
  //   content:
  //     "Cuộc họp ngày 28/08/2025 đã thảo luận về tiến độ dự án AI. Các thành viên đều đồng ý với kế hoạch sprint tiếp theo.",
  //   summary: "Tổng kết tiến độ & kế hoạch sprint mới",
  //   file: null, // hoặc "/files/meeting-note-001.pdf"
  //   createdAt: "2025-08-29T10:00:00Z",
  // };
  const {id}=useParams();
  // xóa note
  const handleDelete = async(id) => {
    try {
      const response = await deleteNote(id);
      if (response.success===true) {
        navigate(-1);
        toast.success("Delete note success");
      }
    } catch {
      toast.error("Delete note failed");
    }
  };
  // mở hàm update
  const handleUpdate = () => {
    setUpdate(true);
  };
  //lấy dữ liệu chi tiết notes
  useEffect(() => {
    // Gọi API để lấy dữ liệu chi tiết ghi chú
    const fetchNoteDetail = async () => {
      try {
        const response = await getNote(id);
        setNote(response.data);
      } catch (e) {
        // console.error("Error fetching note detail:", e);
        toast.error(e.response.message ||"Error fetching note detail");
      }
    };

    fetchNoteDetail();
  }, [id]);
  // console.log("note",note.id);
  
  // mở qua /flashcards/multiple-choice
  const handleFlashcardMultipleChoice = (id) => {
    navigate(`/flashcards/multiple-choice/${id}`);
  };
  return (
    <div className="space-y-6">
        {update && <UpdateNote onClose={()=>setUpdate(false)} id={id} />}
        {openDelete && <ConfirmDeleteModal
        open={openDelete}
        onOk={() => handleDelete(id)} 
        onCancel={() => setOpenDelete(false)}
      />}
            <div className="rounded-xl overflow-hidden mt-10 flex justify-center">
     <Back/>
      <div className="w-10/12 ">
        <h2
          className="text-3xl font-bold text-center mb-6 
          bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 
          text-transparent bg-clip-text animate-pulse"
        >
          📑 Note Detail
        </h2>

        <Card
          className="shadow-lg rounded-xl bg-black/20 backdrop-blur-md border border-cyan-200"
          hoverable
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Tag color="cyan" className="px-3 py-1 rounded-full">
              {note.id}
            </Tag>
          </div>

          {/* Title */}
          <div className="mb-4">
            <Text strong className="text-xl text-cyan-300">
              {note.title}
            </Text>
          </div>
            {/* Summary */}
          <div className="mb-3">
            <Text className="text-cyan-300">Tóm tắt:</Text>
            <Text className="ml-2 text-white/80">{note.summary}.</Text>
          </div>
          {/* Content */}
          <div className="mb-3">
            <Text className="text-cyan-300">Content:</Text>
            <Text className="text-white ml-2">{note.content || <i >Không có (chỉ file)</i>}</Text>
          </div>

          

          {/* File */}
          <div className="mb-3">
            <Text className="text-cyan-300">File:</Text>
            {note.file_url ? (
              <a
                href={note.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-white/60 hover:underline"
              >
                📥 Download PDF
              </a>
            ) : (
              <i className="ml-2 text-gray-400">Không có</i>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4">
            <Tag color="green" className="px-3 py-1 rounded-full cursor-default">
              {fmtDate(note.created_at)}
            </Tag>
             <Space>
              <Button type="primary" style={{backgroundColor:"#1677ff",color: 'white', opacity: 1,cursor: 'not-allowed'}} disabled onClick={handleUpdate}>
                ✏️ Update
              </Button>
              <Button danger onClick={() => setOpenDelete(true)} >
                ❌ Delete
              </Button>
            </Space>
          </div>
        </Card>
      </div>

      <Button type="primary" className="mt-4 bg-inherit border-cyan-200 text-cyan-200 " onClick={() => handleFlashcardMultipleChoice(note.id)}>
        Flashcards
      </Button>
        
    </div>
    </div>

  );
}

export default NoteDetail;
