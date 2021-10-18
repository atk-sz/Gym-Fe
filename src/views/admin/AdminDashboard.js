import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  attendanceCheck,
  createAttendance,
  displayAttendance,
} from "../../api/attendance";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
} from "react-bootstrap";
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
import moment from "moment";

const AdminDashboard = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [aID, setAID] = useState("");
  const [gID, setGID] = useState("");
  const [att, setAtt] = useState({});
  const [count, setCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [statsRange, setStatsRange] = useState("weekly");
  const [chartData, setChartData] = useState({});
  const [gym, setGym] = useState({});
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadAttendance();
    loadAllMembers();
    loadGymDetails();
  }, []);

  const loadAttendance = async () => {
    const res = await attendanceCheck(user.token, dateToday);
    setGym(res.data.gym);
    setGID(res.data.gym._id);
    if (res.data.attendance.length) {
      console.log(
        new Date(res.data.attendance[res.data.attendance.length - 1].date)
      );
      console.log(dateToday);
      console.log(
        new Date(res.data.attendance[res.data.attendance.length - 1].date) -
          dateToday ==
          0
      );
      if (
        new Date(res.data.attendance[res.data.attendance.length - 1].date) -
          dateToday ==
        0
      ) {
        console.log("going to display");
        const resultAttendance = await displayAttendance(
          user.token,
          res.data.attendance[res.data.attendance.length - 1]._id
        );
        setAID(resultAttendance.data._id);
        setAtt(resultAttendance.data);
        setPresentCount(resultAttendance.data.present.length);
        loadPresentCount(resultAttendance.data._id, resultAttendance.data.gym);
      } else {
        console.log("going to create");
        console.log(dateToday);
        const createdAttendance = await createAttendance(
          user.token,
          dateToday,
          res.data.gym._id
        );
        setAID(createdAttendance.data._id);
        setAtt(createdAttendance.data);
        setCount(0);
        setPresentCount(0);
        loadStats(createdAttendance.data.gym);
      }
    } else {
      console.log("new attts");
      console.log(dateToday);
      const createdAttendance = await createAttendance(
        user.token,
        // dateToday.setDate(dateToday.getDate() - 1),
        dateToday,
        res.data.gym._id
      );
      setAID(createdAttendance.data._id);
      setAtt(createdAttendance.data);
      setCount(0);
      setPresentCount(0);
      loadStats(createdAttendance.data.gym);
    }
  };

  const loadGymDetails = async () => {
    try {
      const gymDetails = await getGymDetails(user.token);
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
      const res = await currentInHouse(user.token, attendanceID);
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
      <DashboardContentHeader
        att={att}
        totalCount={members.length}
        presentCount={presentCount}
      />
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
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              "linear-gradient(126deg, rgba(112,255,150,1) 0%, rgba(97,190,175,1) 100%)",
                          }}
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
                          style={{
                            backgroundColor: "rgb(79,15,182)",
                          }}
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
                    {/* <Col md="4">
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
  */}
                    <Col md="12">
                      <Card className="mt-4">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <h3>Member Details</h3>
                            <Button className="btn cust-btn">
                              <Link
                                to="/gym/members/all"
                                style={{ color: "#fff" }}
                              >
                                See All
                              </Link>
                            </Button>
                            <Badge style={{ background: "#0DCAF0" }}></Badge>
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
