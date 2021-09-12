import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMember, getCountriesAndCities } from "../../api/gym";
import { projectStorage } from "../../firebase";
import { Upload } from "antd";
import Webcam from "react-webcam";
import { validateHouseId } from "../../api/member";
import { CameraOutlined } from '@ant-design/icons'
// import ImgCrop from "antd-img-crop";

const AddMemberForm = () => {
  const initialVals = {
    fname: "",
    lname: "",
    phone: "",
    email: "",
    profile: "",
    DOB: "",
    join: "",
    expire: "",
    house_id: "",
    address: {
      first_line: "",
      second_line: "",
      city: "",
      pincode: "",
      country: "",
    },
  };
  const today = new Date();
  const webRef = useRef()
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(initialVals);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [image, setImage] = useState();
  const [validHouseID, setValidHouseID] = useState(true);
  const [load, setLoad] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    getCountriesAndCities()
      .then((res) => {
        setCountries(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
      });
  }, []);

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

  const handleCityChange = (city) => {
    let { address } = values;
    address.city = city;
    setValues({ ...values, address });
  };

  const handleCountryChange = (country) => {
    let { address } = values;
    address.country = country;
    setValues({ ...values, address });
  };

  const handleCountrySelect = async (e) => {
    setLoadingCities(true);
    if (e.target.value !== "Please select the country") {
      try {
        const country = countries.filter(
          (each) => each.country === e.target.value
        );
        setCities(country[0].cities);
        handleCountryChange(e.target.value);
        handleCityChange("");
        setLoadingCities(false);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response
            ? error.response.data
            : "Some error occured please try later"
        );
      }
    } else {
      handleCountryChange("");
      setCities([]);
      handleCityChange("");
    }
  };

  const handleCitySelect = async (e) => {
    if (e.target.value !== "Please select the city") {
      try {
        handleCityChange(e.target.value);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response
            ? error.response.data
            : "Some error occured please try later"
        );
      }
    } else {
      handleCityChange("");
    }
  };

  const handleImageSelect = async (e) => {
    if (e.target.files) {
      setImage(e.target.files);
    } else {
      setImage("");
      toast.error("Please select valid doc");
    }
  };

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      try {
        let storageRef = projectStorage.ref(
          "/Gym/" + user._id + "/Member/Profile" + image.name
        );
        storageRef.put(image).on(
          "state_changed",
          null,
          (err) => console.log(err),
          async () => {
            resolve(await storageRef.getDownloadURL());
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const validateHouseID = e => {
    setLoad(true)
    if (e.target.value.trim()) {
      validateHouseId(e.target.value.trim(), user.token)
        .then(res => {
          setValidHouseID(res.data)
          setLoad(false)
        })
        .catch(err => {
          console.log(err)
          toast.error(
            err.response
              ? err.response.data
              : "Some error occured please try later"
          );
        })
      // setLoad(true)
    } else {
      setLoad(false)
      setValidHouseID(true)
    }
  }

  const handleLoad = e => {
    setLoad(true)
  }

  const handleCapture = e => {
    e.preventDefault()
    values.profile = webRef.current.getScreenshot()
    setCapturing(false)
    // console.log(webRef.current)
  }

  const handleCloseCamera = e => {
    e.preventDefault()
    setCapturing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validHouseID) {
        if (values.profile.trim()) {
          dateToday.setDate(dateToday.getDate() + 1);
          if (new Date(values.join) - dateToday <= 0)
            toast.error("Joining date cannot be today or before");
          else {
            if (new Date(values.join) - new Date(values.expire) > 0)
              toast.error("Joining date cannot be after expire");
            else {
              setLoading(true);
              // if (image)  = await uploadImage();
              // if (image) values.profile = await uploadImage();
              const res = await addMember(values, user.token);
              toast.success(res.data);
              setValues(initialVals);
              setLoading(false);
            }
          }
        } else
          toast.error('Take an iamge')
      } else
        toast.error('Invalid House ID')
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
        <h5>loading</h5>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="fname" class="form-label">
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
              <label htmlFor="lname" class="form-label">
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
              <label htmlFor="email" class="form-label">
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

          <div style={{ marginBottom: '30px' }} className="row justify-content-center">
            <div className="col-md-6">
              <label htmlFor="lname" class="form-label">
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="col-md-6">
              {/* <div className="upload-member-image">
                  <label htmlFor="photos" className="form-label">
                    Upload Profile Image*
                  </label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={handleImageSelect}
                    required
                  />
                </div>
                <p className='center'>Or</p> */}
              <div style={{ cursor: 'pointer' }} className="capture-member-image">
                <CameraOutlined onClick={e => setCapturing(true)} style={{ fontSize: '40px' }} />
                <h6>Capture</h6>
                {
                  capturing && (<div style={{ position: 'relative' }} >
                    <button onClick={handleCloseCamera}>X</button>
                    <button onClick={handleCapture}>C</button>
                  </div>)
                }
              </div>
              <div style={{ width: '100px', height: '80px' }} className="web-cam-div">
                {
                  capturing && (<div style={{ position: 'relative' }} >
                    <Webcam ref={webRef} width={100} height={80} />
                  </div>)
                }
                {
                  values.profile.trim() && !capturing && (<img src={values.profile} alt="profile" />)
                }
              </div>
              {/* <Upload
                listType="picture-card"
                fileList={image}
                name="photos"
                id="photos"
                onChange={handleImageSelect}
                required
                multiple
              >
                + Upload
              </Upload> */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
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
            <div className="col-md-4">
              <label className="form-date-label" htmlFor="join-member">
                Joining*
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
                Valid Till*
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
          </div>
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Country*</label>
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
              <label className="form-label">State*</label>
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
                Pincode*
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
          <button disabled={load} type="submit" className="btn btn-primary btn-block w-100">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default AddMemberForm;