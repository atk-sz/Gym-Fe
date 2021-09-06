import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { weeklyStats } from "../../api/gym";
import { getGymStats, superAdminSendMailToMember } from "../../api/super-admin";
import { LineChart } from "../../components";
import { Card, Row, Col, Image, Table } from "react-bootstrap";
import * as AiIcons from "react-icons/ai";

const GymStatistics = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { gym_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState({});
  const [statsRange, setStatsRange] = useState("weekly");
  const [chartData, setChartData] = useState({});
  const [memberDetails, setMemberDetails] = useState({});
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));
  const [message, setMessage] = useState("");

  useEffect(() => {
    getGymStats(user.token, gym_id)
      .then((res) => {
        setGym(res.data);
        setMemberDetails(res.data.members[0]);
        loadStats(gym_id);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
      });
  }, []);

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

  const selectMemberDetails = async (memberID) => {
    const foundMember = gym.members.find((element) => element._id === memberID);
    setMemberDetails(foundMember);
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    try {
      const res = await superAdminSendMailToMember(
        user.token,
        message,
        memberDetails.email
      );
      setMessage("");
      toast.success(res.data);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };

  return (
    <div className="container-fluid superadmin-gym-stats-div">
      <div className="row align-items-start">
        <div className="col-md-12">
          {loading ? (
            <h4>..loading</h4>
          ) : (
            <Card>
              <Card.Body>
                <Row className="align-items-start">
                  <Col md="6">
                    <Card className="shadow">
                      <Card.Body>
                        <h5 className="text-center">Gym Details</h5>
                        <div className="gym-details d-flex justify-content-between">
                          <div>
                            <h3>{gym.name}</h3>
                          </div>
                          <div>
                            <h6>{gym.email}</h6>
                            <h6>{gym.phone}</h6>
                          </div>
                        </div>
                        <div className="image-section text-center">
                          <Image
                            src={gym.logo}
                            alt={gym.name}
                            style={{ maxHeight: "400px" }}
                          />
                        </div>
                        <div className="owner-details">
                          <h5 className="text-center">Owner Details:- </h5>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5> {gym.admin.name}</h5>
                            </div>
                            <div>
                              <h6>{gym.admin.email}</h6>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card className="shadow">
                      <Card.Body>
                        <h5 className="text-center">Gym stats</h5>
                        <div className="gym-attendance">
                          <LineChart chartData={chartData} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={12}>
                    <Card>
                      <Card.Body>
                        <Table>
                          <thead>
                            <tr>
                              <th>Card Id</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gym.members && gym.members.length
                              ? gym.members.map((each, i) => (
                                  <tr key={i}>
                                    <td>{each.card_id}</td>
                                    <td>
                                      {each.fname} {each.lname}
                                    </td>
                                    <td>{each.email}</td>
                                    <td>
                                      <Link
                                        to={{
                                          pathname: `/gym/${gym_id}/statistics/message`,
                                          state: gym_id,
                                        }}
                                      >
                                        <AiIcons.AiOutlineMessage />
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymStatistics;
