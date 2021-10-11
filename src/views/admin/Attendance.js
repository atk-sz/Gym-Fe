import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card } from "react-bootstrap";
import {
  attendanceCheck,
  checkAndMark,
  createAttendance,
  displayAttendance,
} from "../../api/attendance";
import "./styles/members.css";
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import moment from "moment";

const Attendance = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [members, setMembers] = useState([]);
  const [aid, setAid] = useState("");
  const [gid, setGid] = useState("");
  const [logs, setLogs] = useState([]);
  const [disable, setDisable] = useState(false);
  const [gym, setGym] = useState({});
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  const filterMember = ({ absent, logbook }) => {
    return new Promise((resolve, reject) => {
      let members = [];
      logbook.map((each) => {
        members.push({
          user: each.member,
          checkin: each.log[each.log.length - 1].action === "checkin",
        });
      });
      absent.map((each) => {
        members.push({ user: each, checkin: false });
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
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await attendanceCheck(user.token, dateToday);
      setGym(res.data.gym);
      setGid(res.data.gym._id);
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
          setAid(resultAttendance.data._id);
          const resultMems = await filterMember(resultAttendance.data);
          setMembers(resultMems);
          setLoading(false);
          // console.log(resultAttendance.data.logbook);
          setLogs(resultAttendance.data.logbook);
          setLoadingLogs(false);
        } else {
          const createdAttendance = await createAttendance(
            user.token,
            dateToday,
            res.data.gym._id
          );
          setAid(createdAttendance.data._id);
          const resultMems = await filterMember(createdAttendance.data);
          setMembers(resultMems);
          setLoading(false);
          // console.log(createdAttendance.data.logbook);
          setLogs([]);
          setLoadingLogs(false);
        }
      } else {
        const createdAttendance = await createAttendance(
          user.token,
          // dateToday.setDate(dateToday.getDate() - 1),
          dateToday,
          res.data.gym._id
        );
        setAid(createdAttendance.data._id);
        const resultMems = await filterMember(createdAttendance.data);
        setMembers(resultMems);
        setLoading(false);
        // console.log(createdAttendance.data.logbook);
        setLogs([]);
        setLoadingLogs(false);
      }
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const loadLogs = (logs) => {
    setLoadingLogs(true);
    const sortedLogs = logs.sort(
      (a, b) => new Date(b.checkin) - new Date(a.checkin)
    );
    setLogs(sortedLogs);
    setLoadingLogs(false);
  };

  async function handleCheckinToggle(e) {
    try {
      setDisable(true);
      const updatedMembers = members.map((item, i) => {
        if (this === i) {
          const updatedItem = {
            ...item,
            checkin: e.target.checked,
          };
          return updatedItem;
        }
        return item;
      });

      const res = await checkAndMark(aid, members[this].user._id, user.token);
      setLoadingLogs(true);
      setLogs(res.data.logbook);
      setLoadingLogs(false);
      setMembers(updatedMembers);
      setDisable(false);
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  }

  const displayTime = (date) => {
    const dateAndTime = new Date(date);
    return `${dateAndTime.getHours()} : ${dateAndTime.getMinutes()}`;
  };

  return (
    <div className="container-fluid admin-dashboard-div">
      <div className="row align-items-start">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h3>Attendance</h3>
              <table className="attendance w-100">
                <thead>
                  <th>
                    <h6>Member's Name</h6>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <h6>Check In/Check Out</h6>
                  </th>
                </thead>
                <tr>
                  <td colSpan="3">
                    <hr
                      style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                      }}
                    />
                  </td>
                </tr>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px", width: "100%" }}
                  >
                    <ScaleLoader />
                  </div>
                ) : (
                  <>
                    {members.length
                      ? members.map((each, i) => (
                          <tr key={i} className="member-attendance">
                            <td>
                              {each.user.fname} {each.user.lname}
                            </td>
                            <td
                              className="form-switch"
                              style={{ textAlign: "center" }}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={each.checkin}
                                disabled={disable}
                                onChange={handleCheckinToggle.bind(i)}
                              />
                            </td>
                          </tr>
                        ))
                      : ""}
                  </>
                )}
              </table>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-8">
          <Card>
            <Card.Body>
              <h3>Logs</h3>
              {loadingLogs ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px", width: "100%" }}
                >
                  <ScaleLoader />
                </div>
              ) : (
                <>
                  <table className="logs w-100">
                    <thead>
                      <th>
                        <h6>Name</h6>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <h6>Action(Time)</h6>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <h6>{moment().format("MMMM Do YYYY")}</h6>
                      </th>
                    </thead>
                    <tr>
                      <td colSpan="3">
                        <hr
                          style={{
                            marginBottom: "20px",
                            marginTop: "20px",
                          }}
                        />
                      </td>
                    </tr>
                    {logs.length
                      ? logs.map((each, i) => {
                          return (
                            <tr key={i} className="member-attendance">
                              <td>
                                {each.member.fname} {each.member.lname}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  overflowX: "auto",
                                  display: "flex",
                                  flexWrap: "nowrap",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                }}
                              >
                                {each.log.length
                                  ? each.log.map((item) => {
                                      return (
                                        <span>
                                          {item.action}({displayTime(item.time)}
                                          )
                                        </span>
                                      );
                                    })
                                  : ""}
                              </td>
                            </tr>
                          );
                        })
                      : ""}
                  </table>
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
