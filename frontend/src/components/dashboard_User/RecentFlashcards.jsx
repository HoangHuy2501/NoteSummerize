import React, { useEffect, useState } from 'react';
import {  Play} from "lucide-react"
import { toast } from 'sonner';
import { getLatestFlashcard } from '../../services/flashcard.js';
import { getUserId } from '../../utils/authUtils';
import { useNavigate } from 'react-router-dom';
RecentFlashcards.propTypes = {
    
};

function RecentFlashcards() {
  const navigate=useNavigate();
     const handlePractice = (id) => {
    navigate(`/flashcards/multiple-choice/${id}`);
  };
      const userID = getUserId();
  const [flashcards, setFlashcards] = useState([]);
  const [note_id, setNote_id] = useState([]);
  useEffect(() => {
    // Gọi API để lấy flashcards mới nhất
    const fetchLatestFlashcard = async () => {
      try {
        const result = await getLatestFlashcard(userID);  
        // console.log("data", result.data.data.flashcard);
        setNote_id(result.data.data.note_id);
        // const data = result.data.data;
        if (result.success) {
          if(!Array.isArray(result.data.data.flashcard)){
            setFlashcards("Not data");
            return;
          }
          const parsed = result.data.data.flashcard.map(f => {
    let opts = [];
    if (f.options) {
      opts = f.options
        .replace(/^\{|\}$/g, "") // bỏ dấu { }
        .split(/","/)              // tách bằng dấu ,
        .map(s => s.replace(/"/g, "").trim()); // bỏ dấu " và trim
    }
    return { ...f, options: opts };
  });
          setFlashcards(parsed);
        } else {
          toast.error(result.message);
        }
      } catch (e) {
        console.log("Error fetching flashcards:", e);
        toast.error("Có lỗi xảy ra khi lấy flashcards");
      }
    };
    fetchLatestFlashcard();
  }, [userID]);
    return (
       <div className="w-11/12 bg-inherit rounded-2xl mx-auto  shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Flashcards gần đây</h2>
            <button
              onClick={()=>handlePractice(note_id)}
              className="inline-flex items-center bg-inherit gap-2 px-3 py-2 rounded-lg border hover:bg-cyan-400"
            >
              <Play className="w-4 h-4" /> Practice
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {Array.isArray(flashcards) ? (
              flashcards.slice(0, 7).map((f) => (
                <div key={f.id} className="border border-cyan-400 rounded-xl p-3">
                  {/* <div className="text-xs font-semibold text-gray-500 mb-1">Q</div> */}
                  <div className="font-medium mb-2 text-red-500">{f.question}</div>
                  {/* <div className="text-xs font-semibold text-gray-500 mb-1">A</div> */}
                  {Array.isArray(f.options) &&
              f.options.map((opt, index) => (
                <div key={index} className="text-cyan-300">
                  {opt}
                </div>
              ))}
              </div>
            ))):(
              <div className="text-gray-500 text-center">{flashcards}</div>
            )}
          </div>
        </div>
    );
}

export default RecentFlashcards;