import React, { useEffect, useState } from "react";
import { Radio, Button } from "antd";
import {GetListFlashcardByNote_id} from '../../services/flashcard.js'
Multiple_choice.propTypes = {};

function Multiple_choice({ Note_id }) {
  const [muitiple_choice, setMultiple_choice] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // call api flashcard
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await GetListFlashcardByNote_id(Note_id);
    getOptions(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFlashcards();
  }, [Note_id]);
  // hàm để lấy mảng options trong data
  const getOptions = (data) => {
    const parsed = data.map((f) => {
      let opts = [];
      if (f.options) {
        opts = f.options
          .replace(/^\{|\}$/g, "") // bỏ dấu { }
          .split(/","/) // tách bằng dấu ,
          .map((s) => s.replace(/"/g, "").trim()); // bỏ dấu " và trim
      }
      return { ...f, options: opts };
    });
    setMultiple_choice(parsed);
  };

 // khi người dùng chọn đáp án
  const handleSelect = (id, value) => {
    setSelectedAnswers((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].options = value;
        return updated;
      } else {
        return [...prev, { id, options: value }];
      }
    });
  };
  console.log("đã chọn",selectedAnswers);
  // hàm gửi kiểm tra kết quả
  // const handleSubmit = () => {
  //   try {
      
  //   } catch (error) {
  //     console.log(error);  
      
  //   }
  // }
  return (
    <div>
      {muitiple_choice.map((flashcard, index) => (
        <div key={flashcard.id} className="border-b mt-3 border-gray-500">
          <h2><span className="mr-3">Question {index + 1}/{muitiple_choice.length}:</span>{flashcard.question}</h2>
          <ul>
            <Radio.Group
              onChange={(e) => handleSelect(flashcard.id, e.target.value)}
              value={selectedAnswers.find((a) => a.id === flashcard.id)?.options || null}
            >
              {flashcard.options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  className="block  text-cyan-300"
                >
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </ul>
        </div>
      ))}
      <Button type="primary" className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700
    text-white font-semibold
    shadow-lg shadow-blue-300/30
    px-6 py-3 rounded-full
    transition-all duration-300
    hover:scale-105">Submit</Button>
    </div>
  );
}

export default Multiple_choice;
