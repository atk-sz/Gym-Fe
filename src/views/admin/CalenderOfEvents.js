import React, { useEffect, useState } from "react";
import { Calendar } from "../../components";
import { Card, Container } from "react-bootstrap";
import { loadEventsPerWeek } from "../../api/event";
import { useSelector } from "react-redux";
import { FieldTimeOutlined } from "@ant-design/icons";
// import EventCalender from "../../components/admin/EventCalender";

const CalenderOfEvents = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const events = await loadEventsPerWeek(user.token);
      setEvents(events.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row admin-calender-of-events">
      <div className="col-md-6 calender-div">
        <Calendar />
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
                    <FieldTimeOutlined /> {each.start}-{each.end}
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
