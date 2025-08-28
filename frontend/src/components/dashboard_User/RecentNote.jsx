import React from 'react';
import fmtDate from '../../utils/fmtDate';
import { FileText, Sparkles, Layers3, BookUser, Plus, ExternalLink, Play, BarChart3 } from "lucide-react"
RecentNote.propTypes = {
    
};

function RecentNote() {
      const notes=[
    { id: "n1", title: "Linear Algebra – Lecture 1", created_at: "2025-08-19T10:12:00Z", summary: "Vectors, matrices, operations…" },
    { id: "n2", title: "Computer Networks – TCP/IP", created_at: "2025-08-18T15:22:00Z", summary: "Model OSI, TCP handshake…" },
    { id: "n3", title: "Biology – Photosynthesis", created_at: "2025-08-16T11:05:00Z", summary: "Light-dependent reactions…" },
    { id: "n4", title: "History – WW2 overview", created_at: "2025-08-14T09:45:00Z", summary: "Causes, timeline, key events…" },
    { id: "n5", title: "JS – Event Loop", created_at: "2025-08-12T08:30:00Z", summary: "Call stack, queue, microtasks…" },
  ];
     // Handlers – nối với BE sau
  const handleCreateNote = () => {
    // POST /api/notes
    alert("Tạo note mới (gọi API thật ở đây).");
  };
  const handleOpenNote = (id) => {
    // navigate(`/notes/${id}`)
    alert("Đi tới chi tiết note: " + id);
  };
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
          {notes.slice(0, 5).map((n) => (
            <li key={n.id} className="p-4 flex items-center justify-between border-b border-cyan-400">
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