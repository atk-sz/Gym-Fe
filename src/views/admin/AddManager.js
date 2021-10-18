import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCountriesAndCities } from "../../api/gym";
import { addManager } from "../../api/admin";
import { AddManagerForm } from "../../components";
import { auth, projectStorage } from "../../firebase";
import { Card } from "react-bootstrap";

const AddManager = () => {
  const initialVals = {
    fname: "",
    lname: "",
    phone: "",
    email: "",
    profile: "",
    address: {
      first_line: "",
      second_line: "",
      city: "",
      pincode: "",
      country: "",
    },
  };
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(initialVals);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [image, setImage] = useState([]);
  
  useEffect(() => {
    getCountriesAndCities()
      .then((res) => {
        setCountries(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
          "/Gym/" + user._id + "/Manager/Profile" + image.name
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (image) values.profile = await uploadImage();
      values.email = values.email.toLocaleLowerCase();
      await auth.createUserWithEmailAndPassword(values.email, "password");
      const res = await addManager(user.token, values);
      toast.success("Manager Added");
      setValues(initialVals);
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

  return (
    <div className="container-fluid add-manager-div">
      <div className="row">
        <div className="col-md-8 text-center">
          <Card>
            <Card.Body>
              {loading ? (
                <h1>loading</h1>
              ) : (
                <AddManagerForm
                  values={values}
                  countries={countries}
                  cities={cities}
                  loadingCities={loadingCities}
                  handleChange={handleChange}
                  handleAddressChange={handleAddressChange}
                  handleCountrySelect={handleCountrySelect}
                  handleCitySelect={handleCitySelect}
                  handleImageSelect={handleImageSelect}
                  handleSubmit={handleSubmit}
                  image={image}
                />
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddManager;
