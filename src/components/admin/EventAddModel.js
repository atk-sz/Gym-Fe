import React, { useState } from "react";
import { Modal } from "antd";
import Datetime from "react-datetime";

const EventAddModel = ({ onOpen, onClose, values, handleChange, handleSubmit }) => {

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
            value={values.title}
            name="title"
            onChange={handleChange}
            className="form-control"
            id="new-title"
            aria-describedby="emailHelp"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="new-description" className="form-label">
            Description
          </label>
          <input
            type="text"
            value={values.description}
            name="description"
            onChange={handleChange}
            className="form-control"
            id="new-description"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            value={values.location}
            name="location"
            onChange={handleChange}
            className="form-control"
            id="location"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="number_of_guests" className="form-label">
            Number Of Guests
          </label>
          <input
            type="number"
            value={values.number_of_guests}
            name="number_of_guests"
            onChange={handleChange}
            className="form-control"
            id="number_of_guests"
            max='100'
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-date-label" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={values.date}
            className="form-control mb-3"
            id="date"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-time-label" htmlFor="start">
            Start
          </label>
          <input
            type="time"
            name="start"
            value={values.start}
            className="form-control mb-3"
            id="start"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-time-label" htmlFor="end">
            End
          </label>
          <input
            type="time"
            name="end"
            value={values.end}
            className="form-control mb-3"
            id="end"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default EventAddModel;
