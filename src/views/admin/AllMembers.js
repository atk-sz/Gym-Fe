import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllGymMembers } from "../../api/gym";
import { Card, Table, Badge, Container } from "react-bootstrap";
import { BiSortAlt2 } from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { adminSendMailToMember } from "../../api/admin";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { AddMemberForm } from "../../components";
import "./styles/members.css";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
);
// const { TextArea } = Input;

const DraftMessageForm = ({
  handleSend,
  draftMessage,
  setDraftMessage,
  sendingMessage,
  draftSubject,
  setDraftSubject,
}) => {
  return (
    <>
      {sendingMessage ? (
        <h3>Sending Message</h3>
      ) : (
        <form onSubmit={handleSend}>
          <div style={{ marginBottom: "20px" }} className="md-3">
            <input
              type="text"
              className="form-control"
              value={draftSubject}
              onChange={(e) => setDraftSubject(e.target.value)}
              placeholder="Subject"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              style={{ resize: "none", width: "100%" }}
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              rows="5"
              placeholder="Message..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

const AllMembers = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [nameSort, setNameSort] = useState(true);
  const [houseIdSort, setHouseIdSort] = useState(true);
  const [expireSort, setExpireSort] = useState(true);
  const [activeSort, setActiveSort] = useState(true);
  const [messageMember, setMessageMember] = useState({});
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [draftVisible, setDraftVisible] = useState(false);
  const [draftMembers, setDraftMembers] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const updateAllMembers = (members) => {
    return new Promise((resolve, reject) => {
      const updatedMember = members.map((each) => {
        let member = each;
        member.fullName = `${each.fname} ${each.lname}`;
        return member;
      });
      resolve(updatedMember);
    });
  };

  const sortByName = () => {
    let membersUpdate = members;
    if (nameSort) {
      membersUpdate.sort(function (a, b) {
        if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
          return -1;
        }
        if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      membersUpdate.reverse();
    } else
      membersUpdate.sort(function (a, b) {
        if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
          return -1;
        }
        if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    setMembers(membersUpdate);
    setNameSort(!nameSort);
  };

  const sortByHouseId = () => {
    let membersUpdate = members;
    if (houseIdSort) {
      membersUpdate.sort(function (a, b) {
        if (a.house_id.toLowerCase() < b.house_id.toLowerCase()) {
          return -1;
        }
        if (a.house_id.toLowerCase() > b.house_id.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      membersUpdate.reverse();
    } else
      membersUpdate.sort(function (a, b) {
        if (a.house_id.toLowerCase() < b.house_id.toLowerCase()) {
          return -1;
        }
        if (a.house_id.toLowerCase() > b.house_id.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    setMembers(membersUpdate);
    setHouseIdSort(!houseIdSort);
  };

  const sortByExpire = () => {
    let membersUpdate = members;
    if (expireSort) {
      membersUpdate.sort((a, b) => new Date(b.expire) - new Date(a.expire));
    } else
      membersUpdate.sort((a, b) => new Date(a.expire) - new Date(b.expire));
    setMembers(membersUpdate);
    setExpireSort(!expireSort);
  };

  const sortByActive = () => {
    let membersUpdate = members;
    if (activeSort) {
      membersUpdate.sort((a, b) =>
        a.active === b.active ? 0 : a.active ? -1 : 1
      );
    } else
      membersUpdate.sort((a, b) =>
        a.active === b.active ? 0 : a.active ? 1 : -1
      );
    setMembers(membersUpdate);
    setActiveSort(!activeSort);
  };

  const lastActiveDisplay = (last_active) => {
    switch (last_active.state) {
      case "new":
        return "New Member";
      case "active now":
        return "Active Now";
      default:
        if (
          new Date(new Date(last_active.date).setHours(0, 0, 0, 0)) -
            new Date().setHours(0, 0, 0, 0) ===
          0
        )
          return "Today";
        return displayDate(new Date(last_active.date));
    }
  };

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getAllGymMembers(user.token);
      const updatedMembers = await updateAllMembers(res.data);
      setMembers(updatedMembers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const displayDate = (date) => {
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };

  const handleSendMessage = (member) => {
    setMessageMember(member);
    setShowMessageBox(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    adminSendMailToMember(user.token, message, messageMember.email)
      .then((res) => {
        toast.success(res.data);
        setShowMessageBox(false);
        setMessageMember({});
        setMessage("");
        setSending(false);
      })
      .catch((err) => {
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
        setSending(false);
      });
  };

  const handleSelect = (value, member, index) => {
    const membersToUpdate = draftMembers;
    if (value) {
      const i = membersToUpdate.findIndex((item) => item == member);
      if (!i >= 0) {
        membersToUpdate.push(member);
        setDraftMembers(membersToUpdate);
      }
    } else {
      const resultingmembers = membersToUpdate.filter(
        (each) => each !== member
      );
      setDraftMembers(resultingmembers);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setSendingMessage(true);
      const checkboxes = document.getElementsByClassName("select-check");
      if (!draftMembers.length) {
        setSendingMessage(false);
        return toast.error("First please select some members");
      }
      await adminSendMailToMember(
        user.token,
        draftMessage,
        draftMembers,
        draftSubject
      );
      for (let i = 0; i < checkboxes.length; i++)
        if (checkboxes[i].type == "checkbox") checkboxes[i].checked = false;
      setSendingMessage(false);
      setDraftVisible(false);
      setDraftMembers([]);
      setDraftMessage("");
      setDraftSubject("");
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Some error occured please try later");
      console.log(error);
      setSendingMessage(false);
    }
  };

  const filteredItems = members.filter((item) =>
    item.fullName.toLocaleLowerCase().includes(keyword)
  );

  const membersToDisplay = keyword ? filteredItems : members;

  return (
    <div className="container-fluid all-member-of-gym-div">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Body>
              <Container style={{ marginBottom: "2rem" }}>
                <div className="d-flex justify-content-between">
                  <div>
                    <button
                      className="btn cust-btn"
                      onClick={() => setDraftVisible(true)}
                    >
                      Draft Message
                    </button>
                    <Modal
                      title="Draft Messaging"
                      centered
                      visible={draftVisible}
                      footer={null}
                      onCancel={() => setDraftVisible(false)}
                      width={1000}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                        className="selected-members-for-draft"
                      >
                        {draftMembers.length
                          ? draftMembers.map((each, i) => {
                              return <p key={i}>{each}</p>;
                            })
                          : ""}
                      </div>
                      <DraftMessageForm
                        handleSend={handleSend}
                        draftMessage={draftMessage}
                        setDraftMessage={setDraftMessage}
                        sendingMessage={sendingMessage}
                        draftSubject={draftSubject}
                        setDraftSubject={setDraftSubject}
                      />
                    </Modal>
                  </div>
                  <div>
                    <button
                      className="btn cust-btn"
                      onClick={() => setVisible(true)}
                    >
                      Add Member
                    </button>
                    <Modal
                      title="Add Member"
                      centered
                      visible={visible}
                      footer={null}
                      onCancel={() => setVisible(false)}
                      width={1000}
                    >
                      <AddMemberForm loadMembers={loadMembers} />
                    </Modal>
                    <input
                      style={{
                        display: "inline",
                        width: "auto",
                        marginLeft: "15px",
                      }}
                      className="form-control"
                      type="text"
                      placeholder="Search by Name"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </div>
              </Container>

              <Table>
                <thead>
                  <tr>
                    <th>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </th>

                    <th style={{ cursor: "default" }} onClick={sortByName}>
                      Name <BiSortAlt2 />
                    </th>
                    <th style={{ cursor: "default" }} onClick={sortByHouseId}>
                      House Id <BiSortAlt2 />
                    </th>
                    <th style={{ cursor: "default" }} onClick={sortByExpire}>
                      Expire <BiSortAlt2 />
                    </th>
                    <th
                    // style={{ cursor: "default" }} onClick={sortByActive}
                    >
                      Last Active
                      {/* <BiSortAlt2 /> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div style={{ textAlign: "center" }} colSpan="5">
                      <ScaleLoader />
                    </div>
                  ) : membersToDisplay && membersToDisplay.length ? (
                    membersToDisplay.map((each, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            className="form-check-input select-check"
                            type="checkbox"
                            onChange={(e) => {
                              handleSelect(e.target.checked, each.email, i);
                            }}
                          />
                        </td>

                        <td>
                          <Link
                            to={`/gym/member/${each._id}`}
                            style={{ color: "#000" }}
                          >
                            <td>{`${each.fullName}`}</td>
                          </Link>
                        </td>
                        <td>{each.house_id}</td>
                        <td>{displayDate(new Date(each.expire))}</td>
                        <td>{lastActiveDisplay(each.last_active)}</td>
                        {/* <td
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            handleSendMessage(each);
                          }}
                        >
                          <AiIcons.AiOutlineMessage />
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    ""
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
      {showMessageBox && (
        <div className="admin-send-message-box-div">
          <div className="admin-send-message-box">
            <button className="close" onClick={(e) => setShowMessageBox(false)}>
              X
            </button>
            <h3>{messageMember.fullName}</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                required
                disabled={sending}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                cols="30"
                rows="5"
              ></textarea>
              <button disabled={sending} className="btn btn-primary">
                {sending ? <Spin indicator={antIcon} /> : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMembers;
