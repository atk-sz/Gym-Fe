import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMember, getCountriesAndCities } from "../../api/gym";
import { getDuratoins } from "../../api/duration";
import { projectStorage } from "../../firebase";
import { Upload } from "antd";
import Webcam from "react-webcam";
import { validateHouseId } from "../../api/member";
import { CameraOutlined } from "@ant-design/icons";
import ScaleLoader from "react-spinners/ScaleLoader";
// import ImgCrop from "antd-img-crop";

const AddMemberForm = ({ loadMembers }) => {
  const initialVals = {
    fname: "",
    lname: "",
    phone: "",
    email: "",
    profile: "",
    DOB: "",
    join: new Date(),
    expire: "",
    house_id: "",
    address: {
      first_line: "",
      second_line: "",
      city: "",
    },
  };
  const today = new Date();
  const webRef = useRef();
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(initialVals);
  const [validHouseID, setValidHouseID] = useState(true);
  const [load, setLoad] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [durations, setDurations] = useState([]);
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    loadDuration();
  }, []);

  const loadDuration = async (gid) => {
    try {
      setLoading(true);
      const res = await getDuratoins(user.token);
      let arr = res.data.values;
      arr.sort((a, b) => a - b);
      setDurations(arr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    let { address } = values;
    setValues({
      ...values,
      address: { ...address, [e.target.name]: e.target.value },
    });
  };

  const validateHouseID = (e) => {
    setLoad(true);
    if (e.target.value.trim()) {
      validateHouseId(e.target.value.trim(), user.token)
        .then((res) => {
          setValidHouseID(res.data);
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            err.response
              ? err.response.data
              : "Some error occured please try later"
          );
        });
      // setLoad(true)
    } else {
      setLoad(false);
      setValidHouseID(true);
    }
  };

  const handleLoad = (e) => {
    setLoad(true);
  };

  const handleCapture = (e) => {
    e.preventDefault();
    values.profile = webRef.current.getScreenshot();
    setCapturing(false);
  };

  const handleCloseCamera = (e) => {
    e.preventDefault();
    setCapturing(false);
  };

  const handleValidityChange = (e) => {
    const addMonths = (date, months) => {
      var d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
      return date;
    };
    setValues({ ...values, expire: addMonths(new Date(), e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validHouseID) {
        if (values.profile.trim()) {
          dateToday.setDate(dateToday.getDate() + 1);
          if (new Date(values.join) - dateToday > 0)
            toast.error("Joining date cannot be before");
          else {
            if (new Date(values.join) - new Date(values.expire) > 0)
              toast.error("Joining date cannot be after expire");
            else {
              setLoading(true);
              const res = await addMember(values, user.token);
              toast.success(res.data);
              setValues(initialVals);
              loadMembers();
              setLoading(false);
            }
          }
        } else toast.error("Take an iamge");
      } else toast.error("Invalid House ID");
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px", width: "100%" }}
        >
          <ScaleLoader />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="fname" className="form-label">
                First Name*
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
                Last Name*
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
                Phone*
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
                Email address*
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

          <div
            style={{ marginBottom: "30px" }}
            className="row justify-content-center"
          >
            <div className="col-md-6">
              <label className="form-date-label" htmlFor="DOB-member">
                Date Of Birth*
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
            <div className="col-md-6">
              <label htmlFor="lname" className="form-label">
                House ID
              </label>
              <input
                type="text"
                name="house_id"
                value={values.house_id}
                placeholder="2012QHUSE8MQFRUDS"
                className="form-control mb-3"
                id="house_id"
                onChange={handleChange}
                onBlur={validateHouseID}
                onFocus={handleLoad}
              />
            </div>
          </div>
          <div className="row">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="col-md-6"
            >
              <div
                style={{ cursor: "pointer" }}
                className="capture-member-image"
              >
                <CameraOutlined
                  onClick={(e) => setCapturing(true)}
                  style={{ fontSize: "40px" }}
                />
                <h6>Capture</h6>
                {capturing && (
                  <div style={{ position: "relative" }}>
                    <button onClick={handleCloseCamera}>X</button>
                    <button onClick={handleCapture}>C</button>
                  </div>
                )}
              </div>
              <div
                style={{ width: "100px", height: "80px" }}
                className="web-cam-div"
              >
                {capturing && (
                  <div style={{ position: "relative" }}>
                    <Webcam ref={webRef} width={100} height={80} />
                  </div>
                )}
                {values.profile.trim() && !capturing && (
                  <img src={values.profile} alt="profile" />
                )}
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Valid Till*</label>
              {durations && (
                <select
                  className="form-select mb-3"
                  name="expire"
                  onChange={handleValidityChange}
                  required
                >
                  <option defaultValue>Please select the validity</option>
                  {durations.map((each, i) => (
                    <option key={i} value={each}>
                      {each} months
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label htmlFor="first_line" className="form-label">
                Address*
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
            <div className="col-md-12">
              <label htmlFor="city" className="form-label">
                City*
              </label>
              <input
                type="text"
                value={values.address.city}
                name="city"
                placeholder="delhi"
                className="form-control mb-3"
                id="city"
                onChange={handleAddressChange}
              />
            </div>
          </div>
          <button
            disabled={load}
            type="submit"
            className="btn btn-primary btn-block w-100"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default AddMemberForm;
