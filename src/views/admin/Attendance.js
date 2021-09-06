import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "react-bootstrap";
import {
  createOrDisplayAttendance,
  getLogs,
  markAbsent,
  markPresent,
} from "../../api/attendance";
import "./styles/members.css";

const Attendance = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [members, setMembers] = useState([]);
  const [aid, setAid] = useState("");
  const [gid, setGid] = useState("");
  const [logs, setLogs] = useState([]);
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  const filterMember = ({ present, absent }) => {
    return new Promise((resolve, reject) => {
      let members = [];
      present.map((each) => {
        members.push({ user: each, attendance: true });
      });
      absent.map((each) => {
        members.push({ user: each, attendance: false });
      });
      members.sort((a, b) => {
        if (a.user.fname.toLowerCase() === b.user.fname.toLowerCase())
          return a.user.lname.localeCompare(b.user.lname);
        return a.user.fname.localeCompare(b.user.fname);
      });
      resolve(members);
    });
  };

  useEffect(() => {
    createOrDisplayAttendance(user.token, dateToday)
      .then(async (res) => {
        setAid(res.data._id);
        const resultMems = await filterMember(res.data);
        setMembers(resultMems);
        setLoading(false);
        setGid(res.data.gym);
        loadLogs(user.token, res.data.gym);
      })
      .catch((err) => {
        // setLoading(false);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
      });
  }, []);

  const loadLogs = (token, gym_id) => {
    getLogs(token, gym_id)
      .then(async (res) => {
        const sortedLogs = res.data.sort(
          (a, b) => new Date(b.checkin) - new Date(a.checkin)
        );
        setLogs(sortedLogs);
        setLoadingLogs(true);
        setLoadingLogs(false);
      })
      .catch((err) => {
        setLoadingLogs(false);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
      });
  };

  async function handleToggle(e) {
    try {
      const updatedMembers = members.map((item, i) => {
        if (this === i) {
          const updatedItem = {
            ...item,
            attendance: e.target.checked,
          };
          return updatedItem;
        }
        return item;
      });

      if (e.target.checked) {
        await markPresent(aid, members[this].user._id, user.token);
        loadLogs(user.token, gid);
      } else {
        await markAbsent(aid, members[this].user._id, user.token);
        loadLogs(user.token, gid);
      }
      setMembers(updatedMembers);
    } catch (error) {
      console.log(error.message);
    }
  }

  const displayDateAndTime = (date) => {
    const dateAndTime = new Date(date);
    return `${dateAndTime.getHours()} : ${dateAndTime.getMinutes()} , ${dateAndTime.getDate()}-${
      dateAndTime.getMonth() + 1
    }-${dateAndTime.getFullYear()}`;
  };

  return (
    <div className="container-fluid admin-dashboard-div">
      <div className="row align-items-start">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h3>Attendance</h3>
              <div className="attendance">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6>Member's Name</h6>
                  </div>
                  <div>
                    <h6>Mark Attedence</h6>
                  </div>
                </div>
                <hr
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                  }}
                />
                {members.length
                  ? members.map((each, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="member-attendance"
                      >
                        <Link to={`/gym/member/${each._id}`}>
                          <span>
                            {each.user.fname} {each.user.lname}
                          </span>
                        </Link>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={each.attendance}
                            onChange={handleToggle.bind(i)}
                          />
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-8">
          <Card>
            <Card.Body>
              <h3>Logs</h3>
              {loadingLogs ? (
                <h4>loading...</h4>
              ) : (
                <>
                  <div className="logs">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h6>Member's Name</h6>
                      </div>
                      <div>
                        <h6>Date and Time</h6>
                      </div>
                    </div>
                    <hr
                      style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                      }}
                    />
                    {logs.length
                      ? logs.map((each, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                            className="member-attendance"
                          >
                            <div>
                              {each.member.fname} {each.member.lname}
                            </div>
                            <div>{displayDateAndTime(each.checkin)}</div>
                          </div>
                        ))
                      : ""}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
