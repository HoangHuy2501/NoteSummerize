import React, { useState } from "react";
import { Modal } from "antd";
ComfirDelete.propTypes = {};

function ComfirDelete({ open, onOk, onCancel }) {
    const [loading, setLoading] = useState(false);
     const handleOk = async () => {
    setLoading(true);
    try {
      await onOk(); // chạy hàm onOk bên NoteDetail
    } finally {
      setLoading(false);
    }
  };
  return (
      <Modal
        title="Confirm Delete"
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
  );
}

export default ComfirDelete;
