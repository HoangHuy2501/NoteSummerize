import React from 'react';
import fmtDate from '../../utils/fmtDate';
import {Trash2} from 'lucide-react'

function ListNote({ search }) {
    const filtered = [
    { id: "n1", title: "Linear Algebra – Lecture 1", created_at: "2025-08-19T10:12:00Z" },
    { id: "n2", title: "Computer Networks – TCP/IP", created_at: "2025-08-18T15:22:00Z" },
    { id: "n3", title: "Biology – Photosynthesis", created_at: "2025-08-16T11:05:00Z" },
  ];
  console.log("hihi",search);
  
    const handleDelete = (id) => {
    if (confirm("Xoá note này?")) {
      // DELETE /api/notes/:id
        alert("Xoá note: " + id + " (gọi API thật ở đây).");
    }
  };

  const handleOpen = (id) => {
    // navigate(`/notes/${id}`)
    alert("Đi tới chi tiết note: " + id);
  };
    return (
        <div>
            <ul className=" rounded-2xl bg-inherit shadow-sm">
      <h2 className="text-lg mb-3 font-semibold text-cyan-200">List</h2>
        {filtered.map((n) => (
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
                View
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-sm px-3 py-2 rounded-lg border text-red-600 hover:bg-cyan-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
        </div>
    );
}

export default ListNote;