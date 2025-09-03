import React, { useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import ListNote from "../../components/Note_componment/ListNote";
import { useDebounce } from "../../hooks/useDebounce";
import Create_Note from "../../components/Note_componment/Create_update_Note";

export default function NotesList() {
  //   const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 3000);
  const [create, setCreate] = useState(false);

  const handleCreate = () => {
    setCreate(true);
  };

  return (
    <div className="p-6 space-y-6">
      {create && <Create_Note onClose={() => setCreate(false)} />}
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
      <ListNote search={debouncedSearch} />
    </div>
  );
}
