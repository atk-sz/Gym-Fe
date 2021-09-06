import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Calendar } from "../../components";

const CalenderOfEvents = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="container-fluid admin-calender-of-events">
      <div className="row">
        <div className="col-md-12 text-center">
          {loading ? <h1>..loading</h1> : <Calendar />}
        </div>
      </div>
    </div>
  );
};

export default CalenderOfEvents;
