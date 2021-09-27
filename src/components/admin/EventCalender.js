import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "react-bootstrap";
import EventAddModel from "./EventAddModel";
import { addNewEvent, loadAllEvents } from "../../api/event";
import { useSelector } from "react-redux";

const EventCalender = () => {
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const calenderRef = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));

  const initialvalues = {
    title: '',
    description: '',
    date: '',
    location: '',
    start: '',
    end: '',
    gym: '',
    number_of_guests: '',
  }
  const [values, setValues] = useState(initialvalues)

  useEffect(() => {
    loadEvents();
  }, []);

  const onEventAdded = (event) => {
    let calendarApi = calenderRef.current.getApi();
    calendarApi.addEvent(event);
  };

  const loadEvents = () => {
    loadAllEvents(user.token).then((res) => {
      setEvents(res.data);
      console.log(res.data)
    });
  };

  const handleEventAdd = (event) => {
    try {
      addNewEvent(user.token, event);
      setVisible(false);
      loadEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setVisible(false)
    setValues(initialvalues)
  }

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEventAdd(values);
  };

  return (
    <div>
      <div className="add-event">
        <Button className="add-event-button" onClick={() => setVisible(true)}>
          Add Event
        </Button>
        <EventAddModel
          onOpen={visible}
          onClose={handleClose}
          values={values}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
      <FullCalendar
        editable={true}
        ref={calenderRef}
        // eventDrop={this.handleEventDrop}
        // eventClick={this.handleEventClick}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        initialView="dayGridMonth"
        selectable={true}
      // eventAdd={(event) => handleEventAdd(event)}
      />
    </div>
  );
};

export default EventCalender;
