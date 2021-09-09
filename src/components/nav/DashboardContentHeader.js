import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getGymDetails, updateGymLogo } from "../../api/gym";
import { createOrDisplayAttendance } from "../../api/attendance";
import { getMemberCount } from "../../api/attendance";
import { loadAllEvents } from "../../api/event";
import { useSelector } from "react-redux";
import { projectStorage } from "../../firebase";
import { toast } from "react-toastify";

const DashboardContentHeader = () => {
  const [members, setMembers] = useState(true);
  const [activeMembers, setActiveMembers] = useState(true);
  const [attendedMembers, setAttendedMembers] = useState(true);
  const [totalEvents, setTotalEvents] = useState(true);
  const [gym, setGym] = useState({});
  const { user } = useSelector((state) => ({ ...state }));
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const gymDetails = await getGymDetails(user.token);
      setGym(gymDetails.data)
      const attendanceResponse = await createOrDisplayAttendance(user.token, dateToday);
      const memberResponse = await getMemberCount(user.token, attendanceResponse.data._id);
      const events = await loadAllEvents(user.token);
      setMembers(gymDetails.data.members);
      setAttendedMembers(attendanceResponse.data.present);
      setActiveMembers(memberResponse);
      setTotalEvents(events.data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      try {
        let storageRef = projectStorage.ref('/Gym/' + gym.email + '/logo/' + image.name)
        storageRef.put(image).on('state_changed',
          null,
          err => console.log(err),
          async () => {
            resolve(await storageRef.getDownloadURL())
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleLogoSelect = async e => {
    if (e.target.files[0]) {
      try {
        const newLogoURL = await uploadImage(e.target.files[0])
        const res = await updateGymLogo(user.token, gym._id, newLogoURL)
        toast.success('Logo updated successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="dashboard-top-head">
      <Container>
        <Row>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Members</div>
                  <div className="content">{members.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Members attended today</div>
                  <div className="content">{attendedMembers.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Active Members</div>
                  <div className="content">{activeMembers.data}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Events</div>
                  <div className="content">{totalEvents.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card dashboard-logo">
              <Card.Body>
                <div className="head">
                  <img style={{ maxWidth: '10vw', maxHeight: '10vh' }} src={gym.logo} alt={gym.name} />
                </div>
                <div className="content">
                  <p>{gym.name}</p>
                  <div className="mb-3">
                    <label htmlFor="logo" className="form-label">Upload Logo</label>
                    <input type="file" id='logo' name="logo" accept="image/*" onChange={handleLogoSelect} required />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardContentHeader;
