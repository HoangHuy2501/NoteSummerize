import React, { useState } from 'react';
import { FileText, Sparkles, Layers3, BookUser, Plus, ExternalLink, Play, BarChart3 } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import RecentNote from '../../components/dashboard_User/RecentNote';
import RecentFlashcards from '../../components/dashboard_User/RecentFlashcards';
import Create_Update_Note from '../../components/Note_componment/Create_update_Note';
Dashboard.propTypes = {

};

// Helper

function Dashboard() {
    const stats = [
    {
      title: "Notes",
      value: "24",
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      desc: "Total Notes created",
    },
    {
      title: "Summaries",
      value: "10",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      desc: "Total Summaries has been AI Generated",
    },
    {
      title: "Flashcards",
      value: "65",
      icon: <Layers3 className="w-6 h-6 text-green-500" />,
      desc: "Total Flashcards",
    },
    {
      title: "Total Friends",
      value: "50",
      icon: <BookUser className="w-6 h-6 text-orange-500" />,
      desc: "Total friends",
    },
  ]
  const [create,setCreate]=useState(false);
//   const [notes, setNotes] = useState([]);
   // Giả lập gọi API

  return (
    <div className='mb-5'>
        {create && <Create_Update_Note onClose={() => setCreate(false)} />}
         <div className=" bg-black sticky top-0 w-full z-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-900/70 rounded-2xl shadow-md p-6 flex items-center gap-4 mt-5"
        >
          <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
          <div>
            <h2 className="text-2xl font-bold ml-3">{stat.value}</h2>
            <p className="text-gray-600 text-sm">{stat.desc}</p>
          </div>
        </div>
      ))}
    </div>
     {/* ===== Recent Notes ===== */}
     <RecentNote onClose={() => setCreate(true)}/>
     {/* ===== Recent Flashcards ===== */}
    <RecentFlashcards />
    </div>
  )
}

export default Dashboard;