import React from "react";
// import { Calendar } from "../../components";
import { Card } from "react-bootstrap";
import EventCalender from "../../components/admin/EventCalender";

const CalenderOfEvents = () => {
  return (
    <div className="container-fluid admin-calender-of-events">
      <div className="row">
        <div className="col-md-12 text-center">
          <Card>
            <Card.Body>
              <EventCalender />
            </Card.Body>
            {/* <Calendar /> */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalenderOfEvents;
