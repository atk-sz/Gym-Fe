import React from "react";
import { Calendar } from "../../components";
import { Card, Container } from "react-bootstrap";
// import EventCalender from "../../components/admin/EventCalender";

const CalenderOfEvents = () => {
  return (
    <div className="container-fluid admin-calender-of-events">
      <div className="row">
        <div className="col-md-6 text-center">
          <div className="cal">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalenderOfEvents;
