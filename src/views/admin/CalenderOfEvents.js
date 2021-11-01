import React, { useEffect, useState } from "react";
import { Calendar } from "../../components";
import { Card, Container } from "react-bootstrap";
import { loadEventsPerWeek } from "../../api/event";
import { useSelector } from "react-redux";
import { FieldTimeOutlined } from "@ant-design/icons";
import { getAllGymMembers } from "../../api/gym";
import { toast } from "react-toastify";
// import EventCalender from "../../components/admin/EventCalender";

const CalenderOfEvents = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getAllGymMembers(user.token);
      setMembers(res.data);
      loadEvents();
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const events = await loadEventsPerWeek(user.token);
      setEvents(events.data);
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

  const displayTime = (date) => `${date.getHours()}:${date.getMinutes()}`;

  return (
    <div className="row admin-calender-of-events">
      <div className="col-md-6 calender-div">
        <Calendar loadEvents={loadEvents} members={members} />
      </div>
      <div style={{ marginLeft: "5%" }} className="col-md-4 events-div">
        {loading ? (
          <h1>loading...</h1>
        ) : (
          <div className="events">
            <h1>Events This Week</h1>
            <hr />
            {events.length ? (
              events.map((each, i) => (
                <div key={i} className="each-event">
                  <p>
                    <FieldTimeOutlined /> {displayTime(new Date(each.start))}-
                    {displayTime(new Date(each.end))}
                  </p>
                  <h3>{each.title}</h3>
                  <h6>{each.location}</h6>
                  <hr />
                </div>
              ))
            ) : (
              <h3>No Events This Week</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalenderOfEvents;
