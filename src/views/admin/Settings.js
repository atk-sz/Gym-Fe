import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addDuration, getDuratoins, removeDuration } from "../../api/duration";
import { getGymDetails } from "../../api/gym";
import { DeleteOutlined } from "@ant-design/icons";

const Settings = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [gymDetail, setGymDetail] = useState({});
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              maxWidth: "400px",
              alignItems: "center",
            }}
            className="gym-name-div"
          >
            <h3>{gymDetail.name}</h3>
            <button className="btn btn-warning">Edit</button>
          </div>
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
            <button className="btn btn-warning">Edit</button>
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
            <Link to="/gym/members/all" className="nav-link">
              <button className="btn btn-primary">See All Managers</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
