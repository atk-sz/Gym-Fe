import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card } from "react-bootstrap";
import {
  createOrDisplayAttendance,
  getLogs,
  markAbsent,
  markCheckout,
  markCheckoutBack,
  markPresent,
} from "../../api/attendance";
import "./styles/members.css";
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Attendance = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [members, setMembers] = useState([]);
  const [aid, setAid] = useState("");
  const [gid, setGid] = useState("");
  const [logs, setLogs] = useState([]);
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  const filterMember = ({ absent, log }) => {
    return new Promise((resolve, reject) => {
      let members = [];
      log.map((each) => {
        members.push({
          user: each.member,
          checkin: true,
          checkout: each.checkout ? true : false,
        });
      });
      absent.map((each) => {
        members.push({ user: each, checkin: false, checkout: false });
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
        loadLogs(res.data.log);
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
      const updatedMembers = members.map((item, i) => {
        if (this === i) {
          const updatedItem = {
            ...item,
            checkin: e.target.checked,
            checkout: !e.target.checked ? false : item.checkout,
          };
          return updatedItem;
        }
        return item;
      });

      if (e.target.checked) {
        const res = await markPresent(aid, members[this].user._id, user.token);
        loadLogs(res.data);
      } else {
        const res = await markAbsent(aid, members[this].user._id, user.token);
        loadLogs(res.data);
      }
      setMembers(updatedMembers);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleCheckoutToggle(e) {
    try {
      const updatedMembers = members.map((item, i) => {
        if (this === i) {
          const updatedItem = {
            ...item,
            checkout: e.target.checked,
          };
          return updatedItem;
        }
        return item;
      });

      if (e.target.checked) {
        const res = await markCheckout(aid, members[this].user._id, user.token);
        loadLogs(res.data);
      } else {
        const res = await markCheckoutBack(
          aid,
          members[this].user._id,
          user.token
        );
        loadLogs(res.data);
      }
      setMembers(updatedMembers);
    } catch (error) {
      console.log(error.message);
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
                    <h6>Check In</h6>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <h6>Check Out</h6>
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
                                onChange={handleCheckinToggle.bind(i)}
                              />
                            </td>
                            <td
                              className="form-switch"
                              style={{ textAlign: "center" }}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={each.checkout}
                                disabled={!each.checkin}
                                onChange={handleCheckoutToggle.bind(i)}
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
                        <h6>Member's Name</h6>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <h6>Check In</h6>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <h6>Check Out</h6>
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
                              <td style={{ textAlign: "center" }}>
                                {displayTime(each.checkin)}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {each.checkout
                                  ? displayTime(each.checkout)
                                  : "-"}
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
