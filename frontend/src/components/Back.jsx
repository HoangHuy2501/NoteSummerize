import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
Back.propTypes = {
    
};

function Back() {
    const navigate = useNavigate();
      const handleBack = () => {
    navigate(-1);
  };
    return (
        <div>
            <Button type="primary" className="mt-4 bg-inherit border-cyan-200 text-cyan-200 " onClick={handleBack}>
        Back
      </Button>
        </div>
    );
}

export default Back;