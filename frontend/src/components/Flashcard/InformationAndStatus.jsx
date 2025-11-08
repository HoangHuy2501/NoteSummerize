import React, { useEffect, useState } from "react";
import {getInformationPoint} from '../../services/InformationPointServices.js'
import { getUserName } from "../../utils/authUtils";
InformationAndStatus.propTypes = {};

function InformationAndStatus({note_id}) {
  const [information, setInformation] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res=await getInformationPoint(note_id);
        setInformation(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[note_id]);
  return (
    <div className="border border-cyan-300 ml-3 mt-14 text-cyan-300 bg-[#0a0f1f]/60 backdrop-blur-sm shadow-xl rounded-xl">
      <h3 className="text-center text-cyan-300 my-3 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)] ">Information</h3>
      <div className="ml-3 text-white">
        <p className="capitalize">
          <span className="font-semibold text-cyan-300">My Name:</span> {getUserName()}
        </p>
        <p className="capitalize">
          <span className="font-semibold text-cyan-300">Name Note:</span> {information.title || "no data"}
        </p>
        <p>
          <span className="font-semibold text-cyan-300">Total Question:</span> {information.total_question || "no data"}
        </p>
      </div>

      <h3 className="text-center text-cyan-300 my-3 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)] ">Status</h3>

      <div className="ml-3 text-white">
        <p>
          <span className="font-semibold text-cyan-300">Point:</span> {information.point || 0}
        </p>
        <p>
          <span className="font-semibold text-cyan-300">Progress Bar:</span> {information.question_true || 0}/{information.total_question || 0}
        </p>
        <p>
          <span className="font-semibold text-cyan-300">Time Success:</span> {information.time_success || 0}
        </p>
      </div>
    </div>
  );
}

export default InformationAndStatus;
