import React from "react";
import { Upload } from "antd";

const AddManagerForm = ({
  values,
  handleChange,
  handleAddressChange,
  handleImageSelect,
  handleSubmit,
  image,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="fname" className="form-label">
              First Name
            </label>
            <input
              type="text"
              name="fname"
              value={values.fname}
              placeholder="Vikram"
              className="form-control mb-3"
              id="fname"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              name="lname"
              value={values.lname}
              placeholder="Singh"
              className="form-control mb-3"
              id="lname"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              placeholder="99999993467"
              value={values.phone}
              className="form-control mb-3"
              id="phone"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              className="form-control mb-3"
              placeholder="info@gmail.com"
              id="email"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <label htmlFor="profile" className="form-label">
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="profile"
              onChange={handleImageSelect}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <label htmlFor="first_line" className="form-label">
              Address
            </label>
            <input
              type="text"
              value={values.address.first_line}
              name="first_line"
              placeholder="House No. 4, Block No. 4"
              className="form-control mb-3"
              id="first_line"
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              value={values.address.second_line}
              name="second_line"
              placeholder="Indraprastha Colony"
              className="form-control mb-3"
              id="second_line"
              onChange={handleAddressChange}
            />
          </div>
        </div>
        <div className="row">
          {/* <div className="col-md-12"> */}
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            value={values.address.city}
            name="city"
            placeholder="Bangalore,Delhi"
            className="form-control mb-3"
            id="city"
            onChange={handleAddressChange}
            required
          />
          {/* </div> */}
        </div>
        <button type="submit" className="btn btn-primary btn-block w-100">
          Submit
        </button>
      </form>
    </>
  );
};

export default AddManagerForm;
