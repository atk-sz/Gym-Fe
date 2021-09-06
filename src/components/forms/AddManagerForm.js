import React from "react";
import { Upload } from "antd";

const AddManagerForm = ({
  values,
  countries,
  cities,
  loadingCities,
  handleChange,
  handleAddressChange,
  handleCountrySelect,
  handleCitySelect,
  handleImageSelect,
  handleSubmit,
  image,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="fname" class="form-label">
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
            <label htmlFor="lname" class="form-label">
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
            <label htmlFor="email" class="form-label">
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
            <label htmlFor="photos" className="form-label">
              Upload Profile Image
            </label>
            <Upload
              listType="picture-card"
              fileList={image}
              name="photos"
              id="photos"
              onChange={handleImageSelect}
              required
              multiple
            >
              + Upload
            </Upload>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label className="form-date-label" htmlFor="DOB-member">
              Date Of Birth
            </label>
            <input
              type="date"
              name="DOB"
              value={values.DOB}
              className="form-control mb-3"
              id="DOB-member"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-date-label" htmlFor="join-member">
              Joining
            </label>
            <input
              type="date"
              name="join"
              value={values.join}
              className="form-control mb-3"
              id="join-member"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-date-label" htmlFor="expire-member">
              Valid Till
            </label>
            <input
              type="date"
              name="expire"
              value={values.expire}
              className="form-control mb-3"
              id="expire-member"
              onChange={handleChange}
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
            <label htmlFor="second_line" className="form-label">
              Address 2
            </label>
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
          <div className="col-md-4">
            <label className="form-label">Country</label>
            {countries && (
              <select
                onChange={handleCountrySelect}
                name="country"
                className="form-select mb-3"
                value={values.address.country}
              >
                <option defaultValue>Please select the country</option>
                {countries.map((each, i) => (
                  <option key={i} value={each.country}>
                    {each.country}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            {cities && (
              <select
                className="form-select mb-3"
                name="city"
                disabled={loadingCities}
                onChange={handleCitySelect}
                value={values.address.city}
              >
                <option defaultValue>Please select the city</option>
                {cities.map((each, i) => (
                  <option key={i} value={each}>
                    {each}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="col-md-4">
            <label htmlFor="pincode" className="form-label">
              Pincode
            </label>
            <input
              type="Number"
              name="pincode"
              className="form-control mb-3"
              id="pincode"
              placeholder="121004"
              onChange={handleAddressChange}
              value={values.address.pincode}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block w-100">
          Submit
        </button>
      </form>
    </>
  );
};

export default AddManagerForm;
