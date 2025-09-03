import React, {  useEffect, useState } from 'react';
import fmtDate from '../../utils/fmtDate';
import { getRecentNotes } from '../../services/crud_note';
import { FileText, Sparkles, Layers3, BookUser, Plus, ExternalLink, Play, BarChart3 } from "lucide-react"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../../utils/authUtils';
RecentNote.propTypes = {
    
};

function RecentNote({onClose}) {
  const navigate = useNavigate();
  const [note,setNote]=useState([]);
     // Handlers – nối với BE sau
  const handleCreateNote = () => {
    // POST /api/notes
    onClose();
  };
  const handleOpenNote = (id) => {
    navigate(`/notes/${id}`)
  };
  const userID = getUserId();
  useEffect(() => {
    // Gọi API để lấy 5 ghi chú gần đây
    
    const fetchRecentNotes = async () => {
      try {
          const response = await getRecentNotes(userID);
          setNote(response.data.data || []);
      } catch (e) {
        console.error("Error fetching recent notes:", e);
        toast.error('Lỗi khi lấy ghi chú gần đây');
      }
    };
    fetchRecentNotes();
  }, [userID]);
    return (
        <div className='w-11/12 mx-auto mt-8 mb-8'>
        <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Notes</h2>
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 hover:border-cyan-400"
          >
            <Plus className="w-4 h-4" /> Create New Note
          </button>
        </div>

        <ul className="divide-y rounded-2xl bg-gray-900/70 border border-cyan-400">
          {note.slice(0, 5).map((n, i) => (
            <li key={n.id} className={`p-4 flex items-center justify-between ${note.length >1 && i !== note.length - 1?`border-b border-cyan-400` : ''}`}>
              <div>
                <div className="font-medium text-cyan-300">{n.title}</div>
                <div className="text-xs text-white">{fmtDate(n.created_at)}</div>
              </div>
              <button
                onClick={() => handleOpenNote(n.id)}
                className="text-sm px-3 py-2 rounded-lg border text-gray-800 hover:bg-cyan-400"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      </section>
        </div>
    );
}

export default RecentNote;