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
  const [event, setEvent] = useState([]);
  const calenderRef = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEvents();
  }, []);

  const onEventAdded = (event) => {
    let calendarApi = calenderRef.current.getApi();
    calendarApi.addEvent({
      title: event.title,
      description: event.description,
      date: event.date,
    });
  };
  const loadEvents = () => {
    loadAllEvents(user.token).then((res) => {
      setEvent(res.data);
    });
  };

  const handleEventAdd = (data) => {
    console.log(data.event);
    try {
      addNewEvent(user.token, data.event);
      setVisible(false);
      loadEvents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="add-event">
        <Button className="add-event-button" onClick={() => setVisible(true)}>
          Add Event
        </Button>
        <EventAddModel
          onOpen={visible}
          onClose={() => setVisible(false)}
          onEventAdded={(event) => onEventAdded(event)}
        />
      </div>
      <FullCalendar
        editable={true}
        ref={calenderRef}
        // eventDrop={this.handleEventDrop}
        // eventClick={this.handleEventClick}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={event}
        initialView="dayGridMonth"
        selectable={true}
        eventAdd={(event) => handleEventAdd(event)}
      />
    </div>
  );
};

export default EventCalender;
