import React, { useState } from "react";
import { Modal } from "antd";
import Datetime from "react-datetime";

const EventAddModel = ({ onOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    onEventAdded({ title, description, date });
  };
  return (
    <Modal
      title="Add Event"
      centered
      visible={onOpen}
      footer={null}
      onCancel={onClose}
    >
      <form onSubmit={handleSubmit} className="new-event-form">
        <div className="mb-3">
          <label htmlFor="new-title" className="form-label">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            id="new-title"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="new-description" className="form-label">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            id="new-description"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <Datetime value={date} onChange={(date) => setDate(date)} />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default EventAddModel;
