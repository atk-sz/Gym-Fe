import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  attendanceCheck,
  createAttendance,
  createOrDisplayAttendance,
  displayAttendance,
} from "../../api/attendance";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import {
  weeklyStats,
  getAllGymMembers,
  currentInHouse,
  getGymDetails,
  updateGymLogo,
} from "../../api/gym";
import { Calendar, LineChart, AddMemberForm } from "../../components";
import { Link, useParams } from "react-router-dom";
import AreaChart from "../../components/admin/AreaChart";
import { projectStorage } from "../../firebase";
import { Modal } from "antd";
import { css } from "@emotion/react";
import DashboardContentHeader from "../../components/nav/DashboardContentHeader";
import ScaleLoader from "react-spinners/ScaleLoader";

const AdminDashboard = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [aID, setAID] = useState("");
  const [gID, setGID] = useState("");
  const [count, setCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [statsRange, setStatsRange] = useState("weekly");
  const [chartData, setChartData] = useState({});
  const [gym, setGym] = useState({});
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadAttendance();
    // loadDashboard();
    // loadAllMembers();
    // loadGymDetails();
  }, []);

  // console.log(count);

  const loadAttendance = async () => {
    const res = await attendanceCheck(user.token, dateToday);
    setGym(res.data.gym);
    setGID(res.data.gym._id);
    if (res.data.attendance.length) {
      if (
        new Date(res.data.attendance[res.data.attendance.length - 1].date) -
          dateToday ==
        0
      ) {
        const resultAttendance = await displayAttendance(
          user.token,
          res.data.attendance[res.data.attendance.length - 1]._id
        );
        setAID(resultAttendance.data._id);
      } else {
        const createdAttendance = await createAttendance(
          user.token,
          dateToday,
          res.data.gym._id
        );
        setAID(createdAttendance.data._id);
      }
    } else {
      const createdAttendance = await createAttendance(
        user.token,
        // dateToday.setDate(dateToday.getDate() - 1),
        dateToday,
        res.data.gym._id
      );
      setAID(createdAttendance.data._id);
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await createOrDisplayAttendance(user.token, dateToday);
      setAID(res.data._id);
      setGID(res.data.gym);
      loadPresentCount(res.data._id, res.data.gym);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };
  const loadGymDetails = async () => {
    try {
      const gymDetails = await getGymDetails(user.token);
      console.log(gymDetails.data);
      setGym(gymDetails.data);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };

  const loadPresentCount = async (attendanceID, gymID) => {
    try {
      const res = await currentInHouse(user.token, gymID);
      setCount(res.data);
      loadStats(gymID);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };

  const loadStats = async (gymID) => {
    try {
      if (statsRange === "weekly") {
        const res = await weeklyStats(user.token, gymID, dateToday);
        setChartData(res.data);
      }
      setLoading(false);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };
  const loadAllMembers = async () => {
    try {
      const res = await getAllGymMembers(user.token);
      setMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      try {
        let storageRef = projectStorage.ref(
          "/Gym/" + gym.email + "/logo/" + image.name
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
        const newLogoURL = await uploadImage(e.target.files[0]);
        const res = await updateGymLogo(user.token, gym._id, newLogoURL);
        loadGymDetails();
        toast.success("Logo updated successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <DashboardContentHeader />
      <Container className="admin-dashboard-div">
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "300px", width: "100%" }}
                  >
                    <ScaleLoader />
                  </div>
                ) : (
                  <Row className="align-items-start justify-content-between">
                    <Col md="4">
                      <div
                        onClick={() => setVisible(true)}
                        className="add-button-section"
                      >
                        <Card
                          className="bg-info text-center p-5"
                          style={{ cursor: "pointer" }}
                        >
                          <h3 className="text-white">Add a new member</h3>
                        </Card>
                      </div>
                      <Modal
                        title="Add Member"
                        centered
                        visible={visible}
                        footer={null}
                        onCancel={() => setVisible(false)}
                        width={1000}
                      >
                        <AddMemberForm />
                      </Modal>
                      <div className="inhouse-count-section mt-4">
                        <Card
                          className=" text-center p-4"
                          style={{ backgroundColor: "#2B2BF7" }}
                        >
                          <h3 className="text-white">Current In House:</h3>
                          <h2 className="text-white">{count}</h2>
                        </Card>
                      </div>
                    </Col>
                    <Col md="8">
                      <Card className="admin-dashboard">
                        <Card.Body>
                          {/* <h4>
                          {presentCount} / {memberCount}
                        </h4> */}
                          <LineChart chartData={chartData} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="8">
                      <Card className="mt-4">
                        <Card.Body>
                          <AreaChart />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card className="mt-4">
                        <Calendar />
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card className="dashboard-head-item-card dashboard-logo mt-4">
                        <Card.Body>
                          <div className="head">
                            <img
                              style={{ maxWidth: "10vw", maxHeight: "10vh" }}
                              src={gym.logo}
                              alt={gym.name}
                            />
                          </div>
                          <div className="content">
                            <p>{gym.name}</p>
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
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="8">
                      <Card className="mt-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5>Member Details</h5>
                            <Badge style={{ background: "#0DCAF0" }}>
                              <Link
                                to="/gym/members/all"
                                style={{ color: "#fff" }}
                              >
                                See All
                              </Link>
                            </Badge>
                          </div>
                          <Table>
                            <thead>
                              <tr>
                                <th>Card Id</th>
                                <th>Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loading ? (
                                <h4 className="text-center">loading</h4>
                              ) : members && members.length ? (
                                members.slice(0, 6).map((each, i) => (
                                  <tr key={i}>
                                    <td>{each.card_id}</td>
                                    <td>
                                      {each.fname} {each.lname}
                                    </td>
                                    <td>{each.email}</td>
                                  </tr>
                                ))
                              ) : (
                                ""
                              )}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
