import React, { useEffect, useState } from 'react';
import {  Play} from "lucide-react"
import { toast } from 'sonner';
import { getLatestFlashcard } from '../../services/flashcard.js';
import { getUserId } from '../../utils/authUtils';
RecentFlashcards.propTypes = {
    
};

function RecentFlashcards() {
  //   const flashcards=[
  //   { id: "f1", question: "What is a vector?", option: ["A. A quantity with both magnitude and direction", "B. A quantity with only magnitude", "C. A quantity with only direction"], answer: "An object with magnitude and direction." },
  //   { id: "f2", question: "TCP 3-way handshake?", option: ["A. SYN → SYN-ACK → ACK", "B. SYN → ACK → SYN-ACK", "C. ACK → SYN → SYN-ACK"], answer: "SYN → SYN-ACK → ACK" },
  //   { id: "f3", question: "Photosynthesis formula", option: ["A. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "B. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₃", "C. 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ + light"], answer: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" },
  //   { id: "f4", question: "OSI Layer 4?", option: ["A. Application layer", "B. Transport layer", "C. Network layer"], answer: "Transport layer" },
  //   { id: "f5", question: "JS microtask?", option: ["A. Promises callbacks run in microtask queue.", "B. Promises callbacks run in macrotask queue.", "C. Promises callbacks run in event loop."], answer: "Promises callbacks run in microtask queue." },
  //   { id: "f6", question: "Matrix multiply?", option: ["A. Dot products of rows/columns.", "B. Element-wise multiplication.", "C. Transpose and then multiply."], answer: "Dot products of rows/columns." },
  //   { id: "f7", question: "Matrix multiply?", option: ["A. Dot products of rows/columns.", "B. Element-wise multiplication.", "C. Transpose and then multiply."], answer: "Dot products of rows/columns." },
  //   { id: "f8", question: "Matrix multiply?", option: ["A. Dot products of rows/columns.", "B. Element-wise multiplication.", "C. Transpose and then multiply."], answer: "Dot products of rows/columns." },
  //   { id: "f9", question: "Matrix multiply?", option: ["A. Dot products of rows/columns.", "B. Element-wise multiplication.", "C. Transpose and then multiply."], answer: "Dot products of rows/columns." },
  //   { id: "f10", question: "Matrix multiply?", option: ["A. Dot products of rows/columns.", "B. Element-wise multiplication.", "C. Transpose and then multiply."], answer: "Dot products of rows/columns." },
  // ];
     const handlePractice = () => {
    // navigate('/flashcards/practice')
    alert("Đi tới trang luyện flashcards.");
  };
      const userID = getUserId();
  const [flashcards, setFlashcards] = useState([]);
  useEffect(() => {
    // Gọi API để lấy flashcards mới nhất
    const fetchLatestFlashcard = async () => {
      try {
        const result = await getLatestFlashcard(userID);
        console.log("data", result.data.data);
        // const data = result.data.data;
        if (result.success) {
          if(!Array.isArray(result.data.data)){
            setFlashcards("Not data");
            return;
          }
          const parsed = result.data.data.map(f => {
    let opts = [];
    if (f.options) {
      opts = f.options
        .replace(/^\{|\}$/g, "") // bỏ dấu { }
        .split(",")              // tách bằng dấu ,
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
              onClick={handlePractice}
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
              f.options.slice(0, 4).map((opt, index) => (
                <div key={index} className="text-gray-700">
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