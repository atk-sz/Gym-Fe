import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getGymDetails } from "../../api/gym";
import { createOrDisplayAttendance } from "../../api/attendance";
import { getMemberCount } from "../../api/attendance";
import { loadAllEvents } from "../../api/event";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const DashboardContentHeader = () => {
  const [members, setMembers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState(0);
  const [attendedMembers, setAttendedMembers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const { user } = useSelector((state) => ({ ...state }));
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  // useEffect(() => {
  //   // loadMembers();
  // }, []);

  // const loadAttendance = async () => {
  //   const res = await attendanceCheck(user.token, dateToday);
  //   setGym(res.data.gym);
  //   setGID(res.data.gym._id);
  //   if (res.data.attendance.length) {
  //     if (
  //       new Date(res.data.attendance[res.data.attendance.length - 1].date) -
  //         dateToday ==
  //       0
  //     ) {
  //       const resultAttendance = await displayAttendance(
  //         user.token,
  //         res.data.attendance[res.data.attendance.length - 1]._id
  //       );
  //       setAID(resultAttendance.data._id);
  //     } else {
  //       const createdAttendance = await createAttendance(
  //         user.token,
  //         dateToday,
  //         res.data.gym._id
  //       );
  //       setAID(createdAttendance.data._id);
  //     }
  //   } else {
  //     const createdAttendance = await createAttendance(
  //       user.token,
  //       // dateToday.setDate(dateToday.getDate() - 1),
  //       dateToday,
  //       res.data.gym._id
  //     );
  //     setAID(createdAttendance.data._id);
  //   }
  // };

  // const loadMembers = async () => {
  //   try {
  //     const gymDetails = await getGymDetails(user.token);
  //     const attendanceResponse = await createOrDisplayAttendance(
  //       user.token,
  //       dateToday
  //     );
  //     const memberResponse = await getMemberCount(
  //       user.token,
  //       attendanceResponse.data._id
  //     );
  //     const events = await loadAllEvents(user.token);
  //     setMembers(gymDetails.data.members);
  //     setAttendedMembers(attendanceResponse.data.present);
  //     setActiveMembers(memberResponse);
  //     setTotalEvents(events.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="dashboard-top-head">
      <Container>
        <Row>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Total Members</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {members.length}</>
                    )}
                  </div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Members attended today</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {attendedMembers.length}</>
                    )}
                  </div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Active Members</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {activeMembers.data}</>
                    )}
                  </div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Total Events</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {totalEvents.length}</>
                    )}
                  </div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardContentHeader;
