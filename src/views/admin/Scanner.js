import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import {
  attendanceCheck,
  checkAndMark,
  createAttendance,
  displayAttendance,
  getLogs,
} from "../../api/attendance";
import "./styles/Scanner.css";

const Scanner = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [aid, setAid] = useState("");
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));
  const [disable, setDisable] = useState(true);
  const [visible, setVisible] = useState(false);
  const [camVisible, setCamVisible] = useState(false);
  const [searchDisable, setSearchDisable] = useState(false);

  const filterMember = ({ absent, logbook }) => {
    return new Promise((resolve, reject) => {
      let members = [];
      logbook.map((each) => {
        members.push({
          user: each.member,
          card_id: each.member.card_id,
        });
      });
      absent.map((each) => {
        members.push({
          user: each,
          card_id: each.card_id,
        });
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
          loadLogs(resultAttendance.data._id);
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
          setLogs([]);
          setLoadingLogs(false);
        }
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

  useEffect(() => {
    if (search.trim()) {
      const i = members.findIndex((_item) => _item.card_id === search);
      if (i > -1) setDisable(false);
      else setDisable(true);
    } else setDisable(true);
  }, [search]);

  const loadLogs = async (aid) => {
    try {
      setLoadingLogs(true);
      const res = await getLogs(user.token, aid);
      //   console.log(res.data);
      sortAndSave(res.data.logs);
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const sortAndSave = (logs) => {
    logs.sort(function (a, b) {
      return new Date(b.time) - new Date(a.time);
    });
    setLogs(logs);
    setLoadingLogs(false);
  };

  const getMemeberId = (cardId) => {
    return new Promise((resolve, reject) => {
      const i = members.findIndex((_item) => _item.card_id === cardId);
      if (i > -1) resolve(members[i]);
      else reject({ response: { data: "Invalid ID" } });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDisable(true);
      setLoadingLogs(true);
      const resultingMember = await getMemeberId(search);
      const resultingAttendance = await checkAndMark(
        aid,
        resultingMember.user._id,
        user.token
      );
      setSearch("");
      setDisable(false);
      loadLogs(resultingAttendance.data._id);
    } catch (error) {
      setDisable(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const displayTime = (date) => {
    const dateAndTime = new Date(date);
    return `${dateAndTime.getHours()} : ${dateAndTime.getMinutes()}`;
  };

  const filteredMembers = members.filter((each) =>
    each.card_id.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const membersToSuggest = search ? filteredMembers : [];

  const handleScan = async (err, result) => {
    try {
      if (result) {
        setSearch(result.text);
        setDisable(true);
        setSearchDisable(true);
        setCamVisible(false);
        setLoadingLogs(true);
        const resultingMember = await getMemeberId(result.text);
        const resultingAttendance = await checkAndMark(
          aid,
          resultingMember.user._id,
          user.token
        );
        setSearch("");
        setDisable(false);
        setSearchDisable(false);
        loadLogs(resultingAttendance.data._id);
      }
    } catch (error) {
      setDisable(false);
      setSearchDisable(true);
      setLoadingLogs(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  return (
    <div className="scanner-page-div">
      {camVisible && (
        <div className="barcode-webcam-div">
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={handleScan}
          />
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center" }} colSpan="5">
          <ScaleLoader />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="search-member">
            <div style={{ position: "relative" }} className="row g-2">
              <div className="col-sm-8">
                <label htmlFor="ID" className="form-label">
                  Member ID
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisible(true);
                  }}
                  className="form-control"
                  id="ID"
                  aria-describedby="idHelp"
                  autoFocus
                  disabled={searchDisable}
                  // required
                />
                {membersToSuggest.length ? (
                  <div
                    className={`suggesstion-div ${visible ? "visible" : ""}`}
                  >
                    {membersToSuggest.map((each, i) => {
                      if (i < 5)
                        return (
                          <h3
                            key={i}
                            onClick={(e) => {
                              setSearch(each.card_id);
                              setVisible(false);
                            }}
                            className="suggesstion"
                          >
                            {each.card_id}
                          </h3>
                        );
                    })}
                  </div>
                ) : (
                  ""
                )}
                <div id="idHelp" className="form-text">
                  Please enter the entire Id of the member
                </div>
              </div>
              <div className="col-sm">
                <button
                  type="submit"
                  disabled={disable}
                  className="btn btn-primary"
                >
                  Mark
                </button>
              </div>
            </div>
          </form>
          {/* <h3>Or</h3> */}
          {/* <div className="scanner-webcam-btn-div">
            <button
              onClick={(e) => setCamVisible(true)}
              className="btn btn-primary"
            >
              {" "}
              Scan
            </button>
          </div> */}
          {loadingLogs ? (
            <div style={{ textAlign: "center" }} colSpan="5">
              <ScaleLoader />
            </div>
          ) : (
            <div className="log-book-div">
              <div className="log-book-header">
                <h4>Card Id</h4>
                <h4>Action</h4>
                <h4>{moment().format("MMMM Do YYYY")}</h4>
              </div>
              {logs.length
                ? logs.map((each, i) => (
                    <div
                      className="primary"
                      key={i}
                      className="log-book-records"
                    >
                      <h3>{each.member.card_id}</h3>
                      <h3>{each.action}</h3>
                      <h3>{displayTime(each.time)}</h3>
                    </div>
                  ))
                : ""}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Scanner;
