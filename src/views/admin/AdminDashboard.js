import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createOrDisplayAttendance,
  getMemberCount,
  getPresentCount,
} from "../../api/attendance";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { weeklyStats, getAllGymMembers } from "../../api/gym";
import { Calendar, LineChart } from "../../components";
import { Link } from "react-router-dom";
import AreaChart from "../../components/admin/AreaChart";

const AdminDashboard = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [aID, setAID] = useState("");
  const [gID, setGID] = useState("");
  const [presentCount, setPresentCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [statsRange, setStatsRange] = useState("weekly");
  const [chartData, setChartData] = useState({});
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    loadDashboard();
    loadAllMembers();
  }, []);

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

  const loadPresentCount = async (attendanceID, gymID) => {
    try {
      setPresentCount(
        await (
          await getPresentCount(user.token, attendanceID)
        ).data
      );
      setMemberCount(
        await (
          await getMemberCount(user.token, attendanceID)
        ).data
      );
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
  return (
    <Container className="admin-dashboard-div">
      <Row>
        <Col md="12">
          <Card>
            <Card.Body>
              <Row className="align-items-start justify-content-between">
                <Col md="4">
                  <Link to="/gym/add/member" className="add-button-section">
                    <Card className="bg-info text-center p-5">
                      <h3 className="text-white">Add a new member</h3>
                    </Card>
                  </Link>
                  <div className="inhouse-count-section mt-4">
                    <Card
                      className=" text-center p-4"
                      style={{ backgroundColor: "#2B2BF7" }}
                    >
                      <h3 className="text-white">Current In House:</h3>
                      <h2 className="text-white">67</h2>
                    </Card>
                  </div>
                </Col>
                <Col md="8">
                  {loading ? (
                    <h4>..loading</h4>
                  ) : (
                    <Card className="admin-dashboard">
                      <Card.Body>
                        {/* <h4>
                          {presentCount} / {memberCount}
                        </h4> */}
                        <LineChart chartData={chartData} />
                      </Card.Body>
                    </Card>
                  )}
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
                    <Card.Body>
                      <Calendar />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md="12">
                  <Card className="mt-4">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>Member Details</h5>
                        <Badge style={{ background: "#0DCAF0" }}>
                          <Link to="/gym/members/all" style={{ color: "#fff" }}>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
