import React, { useEffect, useState } from "react";
import { FileText, Plus, Trash2, Search } from "lucide-react";
import fmtDate from '../../utils/fmtDate';

async function fetchNotes() {
  // GET /api/notes
  return [
    { id: "n1", title: "Linear Algebra – Lecture 1", created_at: "2025-08-19T10:12:00Z" },
    { id: "n2", title: "Computer Networks – TCP/IP", created_at: "2025-08-18T15:22:00Z" },
    { id: "n3", title: "Biology – Photosynthesis", created_at: "2025-08-16T11:05:00Z" },
  ];
}

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setNotes(await fetchNotes());
    })();
  }, []);

  const handleCreate = () => {
    alert("Tạo note mới (POST /api/notes)");
  };

  const handleDelete = (id) => {
    if (confirm("Xoá note này?")) {
      // DELETE /api/notes/:id
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  const handleOpen = (id) => {
    // navigate(`/notes/${id}`)
    alert("Đi tới chi tiết note: " + id);
  };

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-cyan-200">
          <FileText className="w-6 h-6" /> Notes
        </h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black  hover:opacity-90 text-cyan-200 border-cyan-200"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3  text-cyan-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="pl-9 pr-3 py-2 border rounded-xl w-full bg-inherit text-cyan-300 placeholder-cyan-300  focus:(outline-none border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)])  "
        />
      </div>

      {/* List */}
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
