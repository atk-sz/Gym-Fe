import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addDuration, getDuratoins, removeDuration } from "../../api/duration";
import { getGymDetails, updateGymLogo, updateGymName } from "../../api/gym";
import { DeleteOutlined } from "@ant-design/icons";
import { projectStorage } from "../../firebase";

const Settings = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [gymDetail, setGymDetail] = useState({});
  const [name, setName] = useState("");
  const [editable, setEditable] = useState(false);
  const [durations, setDurations] = useState([]);
  const [duration, setDuration] = useState("3");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const res = await getGymDetails(user.token);
      setGymDetail(res.data);
      setName(res.data.name);
      loadDuration(res.data._id);
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

  const loadDuration = async (gid) => {
    try {
      const res = await getDuratoins(user.token, gid);
      setDurations(res.data.values);
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

  const handleEditName = async (e) => {
    e.preventDefault();
    if (editable) {
      if (
        window.confirm(
          `Are you sure you want to change your name form ${gymDetail.name} to ${name}`
        )
      ) {
        try {
          setLoading(true);
          const res = await updateGymName(user.token, gymDetail._id, name);
          setGymDetail(res.data);
          setName(res.data.name);
          setEditable(false);
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
      }
    } else setEditable(true);
  };

  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      try {
        let storageRef = projectStorage.ref(
          "/Gym/" + gymDetail.email + "/logo/" + image.name
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

  const handleLogoSelect = async (e) => {
    if (e.target.files[0]) {
      try {
        if (window.confirm("Are you sure you want to update logo?")) {
          try {
            setLoading(true);
            const newLogoURL = await uploadImage(e.target.files[0]);
            const res = await updateGymLogo(user.token, gymDetail._id, newLogoURL);
            toast.success("Logo updated successfully");
            setGymDetail(res.data);
            setName(res.data.name);
            setEditable(false);
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
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddDuration = async (e) => {
    e.preventDefault();
    if (durations.length < 5) {
      try {
        setLoading(true);
        const res = await addDuration(user.token, duration, gymDetail._id);
        setDurations(res.data.values);
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
    } else toast.warning("Cannot add more than 5 ranges");
  };

  const handleRemove = async (value) => {
    try {
      setLoading(true);
      const res = await removeDuration(user.token, value, gymDetail._id);
      setDurations(res.data.values);
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
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="settings-div">
          <h1>Settings</h1>
          <form
            onSubmit={handleEditName}
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              maxWidth: "400px",
              alignItems: "center",
            }}
            className="gym-name-div"
          >
            <input
              type="text"
              disabled={!editable}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-warning">
              {editable ? "Change" : "Edit"}
            </button>
          </form>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              maxWidth: "600px",
              alignItems: "center",
            }}
            className="gym-logo-div"
          >
            <img
              style={{ maxWidth: "300px", maxHeight: "500px" }}
              src={gymDetail.logo}
              alt={gymDetail.name}
            />
            <div className="mb-3">
              <label htmlFor="logo" className="form-label">
                Upload Logo
              </label>
              <input
                type="file"
                className="form-control"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleLogoSelect}
                required
              />
            </div>
            {/* <button className="btn btn-warning">Edit</button> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
            className="durations-div"
          >
            <div className="durations-all">
              {durations.length ? (
                durations.map((each, i) => {
                  return (
                    <div
                      style={{
                        backgroundColor: "whitesmoke",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        maxWidth: "400px",
                      }}
                      key={i}
                    >
                      <p>{each} months</p>
                      <DeleteOutlined
                        onClick={() => handleRemove(each)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </div>
                  );
                })
              ) : (
                <h3>No durations set</h3>
              )}
            </div>
            <form className="row mb-3" onSubmit={handleAddDuration}>
              <div className="col-md-6">
                <select
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}
                  className="form-control"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
              <div className="col-md-6">
                <button
                  disabled={durations.length >= 5}
                  className="btn btn-success"
                >
                  Add Duration
                </button>
              </div>
            </form>
          </div>
          <div className="see-all mangers-div">
            <Link to="/gym/managers" className="nav-link">
              <button className="btn btn-primary">See All Managers</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
