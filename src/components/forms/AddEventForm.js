import React, { useState } from "react";

const AddEventForm = ({ handleSubmit, editEvent }) => {
  const initialValues = {
    title: "title",
    description: "description",
    location: "location",
    start: "",
    end: "",
    number_of_guests: 100,
  };

  const initialValues1 = {
    minAge: 0,
    maxAge: 0,
    male: true,
    female: true,
  };

  const [values, setValues] = useState(editEvent ? editEvent : initialValues);
  const [values1, setValues1] = useState(initialValues1);
  const [showRange, setShowRange] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChange1 = (e) => {
    setValues1({ ...values1, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(values, values1);
  };

  return (
    <form onSubmit={onSubmit} className="new-event-form">
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
          name="description"
          value={values.description}
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
      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <p>Set Age Range</p>
        <input
          className="form-check-input"
          type="checkbox"
          id="rangeset"
          onChange={(e) => setShowRange(e.target.checked)}
        />
      </div>
      {showRange && (
        <div className="mb-3 row">
          <div className="col-md-4">
            <p>Age Range</p>
          </div>
          <div className="col-md-4">
            <input
              type="Number"
              name="minAge"
              min="0"
              max={values1.maxAge ? values1.maxAge : "60"}
              value={values1.minAge}
              className="form-control mb-3"
              id="minAge"
              onChange={handleChange1}
              placeholder="minmum age"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="Number"
              name="maxAge"
              min={values1.minAge ? values1.minAge : "0"}
              max="60"
              value={values1.maxAge}
              className="form-control mb-3"
              id="maxAge"
              onChange={handleChange1}
              placeholder="maximum age"
              required
            />
          </div>
        </div>
      )}
      <div className="mb-3 row">
        <div className="col-md-6">
          <input
            className="form-check-input"
            type="checkbox"
            value="male"
            id="maleCheckBox"
            onChange={(e) => setValues1({ ...values1, male: e.target.checked })}
            checked={values1.male}
          />
          <label className="form-check-label" htmlFor="maleCheckBox">
            Male
          </label>
        </div>
        <div className="col-md-6">
          <input
            className="form-check-input"
            type="checkbox"
            value="female"
            id="femaleCheckBox"
            onChange={(e) =>
              setValues1({ ...values1, female: e.target.checked })
            }
            checked={values1.female}
          />
          <label className="form-check-label" htmlFor="femaleCheckBox">
            Female
          </label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default AddEventForm;
