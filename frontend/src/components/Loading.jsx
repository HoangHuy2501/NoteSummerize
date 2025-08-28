import React from 'react';
import { ClipLoader } from "react-spinners";
Loading.propTypes = {
    
};

function Loading() {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
    );
}

export default Loading;