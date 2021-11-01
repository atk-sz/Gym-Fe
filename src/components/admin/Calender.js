import React, { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import moment from "moment";
import "./Calender.css";
import {
  addNewEvent,
  loadAllEvents,
  removeServerEvent,
  updateServerEvent,
} from "../../api/event";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AddEventForm from "../forms/AddEventForm";

const MyCalendar = ({ loadEvents, members }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const updateAllDateToMomentDates = (events) => {
    return new Promise((resolve, reject) => {
      // const updatedEvents = events.map(each => each.date = moment().startOf(each.date))
      events.forEach((element) => {
        element.date = moment(element.date);
      });
      resolve(events);
    });
  };

  useEffect(() => {
    loadAllEvents(user.token)
      .then(async (res) => {
        setEvents(await updateAllDateToMomentDates(res.data));
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="calendar-rectangle">
      <div id="calendar-content" className="calendar-content">
        {loading ? (
          <h1>loading</h1>
        ) : (
          <Calendar
            user={user}
            events={events}
            loadEvents={loadEvents}
            members={members}
          />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allEvents: this.props.events,
      selectedMonth: moment(),
      selectedDay: moment().startOf("day"),
      selectedMonthEvents: [],
      loadingDayEvents: false,
      showEvents: false,
      showDialog: false,
      showEventDialog: false,
      viewEvent: null,
      editEvent: null,
      deleteIndex: -1,
      updateIndex: -1,
      edit: false,
      members: this.props.members,
    };
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    // this.addEvent = this.addEvent.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.goToCurrentMonthView = this.goToCurrentMonthView.bind(this);
    this.initialiseEvents();
    this.showDialog = this.showDialog.bind(this);
    this.showEventDialog = this.showEventDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.hideEventDialog = this.hideEventDialog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editEventHandle = this.editEventHandle.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
  }

  previous() {
    const currentMonthView = this.state.selectedMonth;
    this.setState({
      selectedMonth: currentMonthView.subtract(1, "month"),
    });
  }

  next() {
    const currentMonthView = this.state.selectedMonth;
    this.setState({
      selectedMonth: currentMonthView.add(1, "month"),
    });
  }

  select(day) {
    this.setState({
      selectedMonth: day.date,
      selectedDay: day.date.clone(),
      showEvents: true,
    });
  }

  goToCurrentMonthView() {
    const currentMonthView = this.state.selectedMonth;
    this.setState({
      selectedMonth: moment(),
    });
  }

  showCalendar() {
    this.setState({
      selectedMonth: this.state.selectedMonth,
      selectedDay: this.state.selectedDay,
      showEvents: false,
    });
  }

  renderMonthLabel() {
    const currentMonthView = this.state.selectedMonth;
    return (
      <span className="box month-label">
        {currentMonthView.format("MMMM YYYY")}
      </span>
    );
  }

  renderDayLabel() {
    const currentSelectedDay = this.state.selectedDay;
    return (
      <span className="box month-label">
        {currentSelectedDay.format("DD MMMM YYYY")}
      </span>
    );
  }

  renderTodayLabel() {
    const currentSelectedDay = this.state.selectedDay;
    return (
      <span className="box today-label" onClick={this.goToCurrentMonthView}>
        Today
      </span>
    );
  }

  renderWeeks() {
    const currentMonthView = this.state.selectedMonth;
    const currentSelectedDay = this.state.selectedDay;
    const monthEvents = this.state.selectedMonthEvents;

    let weeks = [];
    let done = false;
    let previousCurrentNextView = currentMonthView
      .clone()
      .startOf("month")
      .subtract(1, "d")
      .day("Monday");
    let count = 0;
    let monthIndex = previousCurrentNextView.month();

    while (!done) {
      weeks.push(
        <Week
          previousCurrentNextView={previousCurrentNextView.clone()}
          currentMonthView={currentMonthView}
          monthEvents={monthEvents}
          selected={currentSelectedDay}
          select={(day) => this.select(day)}
        />
      );
      previousCurrentNextView.add(1, "w");
      done = count++ > 2 && monthIndex !== previousCurrentNextView.month();
      monthIndex = previousCurrentNextView.month();
    }
    return weeks;
  }

  removeEvent() {
    const i = this.state.deleteIndex;
    const monthEvents = this.state.selectedMonthEvents.slice();
    const currentSelectedDate = this.state.selectedDay;
    const { user } = this.props;
    let isAfterDay = moment().startOf("day").subtract(1, "d");

    if (currentSelectedDate.isAfter(isAfterDay)) {
      if (window.confirm("Are you sure you want to remove this event?")) {
        let index = i;
        this.hideEventDialog();
        if (index != -1) {
          this.setState({ loadingDayEvents: true });
          removeServerEvent(user.token, monthEvents[index]._id)
            .then((res) => {
              monthEvents.splice(index, 1);
              this.hideEventDialog();
              this.props.loadEvents();
              this.setState({ loadingDayEvents: false });
            })
            .catch((err) => {
              toast.error(
                err.response
                  ? err.response.data
                  : "Some error occured please try later"
              );
              console.log(err);
              this.setState({ loadingDayEvents: false });
            });
        } else {
          alert("No events to remove on this day!");
        }

        this.setState({
          selectedMonthEvents: monthEvents,
        });
      }
    } else {
      window.alert("Cannot delete past events");
    }
  }

  showDialog() {
    const currentSelectedDate = this.state.selectedDay;
    let isAfterDay = moment().startOf("day").subtract(1, "d");

    if (currentSelectedDate.isAfter(isAfterDay)) {
      this.setState({ showDialog: true });
    } else {
      window.alert("Cannot add event for past date");
    }
  }

  showEventDialog(event, i) {
    this.setState({ viewEvent: event, deleteIndex: i });
    this.setState({ showEventDialog: true });
  }

  hideEventDialog() {
    this.setState({ showEventDialog: false, viewEvent: null, deleteIndex: -1 });
  }

  hideDialog() {
    this.hideEventDialog();
    this.setState({
      showDialog: false,
      editEvent: null,
      edit: false,
    });
  }

  editEventHandle() {
    const event = this.state.viewEvent;
    const index = this.state.deleteIndex;
    this.setState({
      showEventDialog: false,
      edit: true,
      updateIndex: index,
      deleteIndex: -1,
    });
    this.setState({ editEvent: event });
    this.showDialog();
  }

  handleSubmit(values) {
    const { user } = this.props;
    let monthEvents = this.state.selectedMonthEvents;
    const currentSelectedDate = this.state.selectedDay;
    const { updateIndex } = this.state;
    values.date = moment(currentSelectedDate).toDate();
    let newEvents = [];
    let startString = values.start,
      endString = values.end;
    const startArr = startString.split(":");
    const endArr = endString.split(":");
    const startTime = moment(currentSelectedDate).toDate();
    const endTime = moment(currentSelectedDate).toDate();
    startTime.setHours(startArr[0], startArr[1]);
    endTime.setHours(endArr[0], endArr[1]);
    if (endTime - startTime > 10740000) {
      values.start = startTime;
      values.end = endTime;
      this.setState({ loadingDayEvents: true });
      this.hideDialog();
      if (this.state.edit) {
        updateServerEvent(user.token, values._id, values)
          .then((res) => {
            let eventToUpdate = res.data;
            eventToUpdate.date = moment(eventToUpdate.date);
            monthEvents[updateIndex] = eventToUpdate;
            this.setState({
              selectedMonthEvents: monthEvents,
              updateIndex: -1,
              edit: false,
            });
            this.props.loadEvents();
            this.setState({ loadingDayEvents: false });
          })
          .catch((err) => {
            this.setState({
              updateIndex: -1,
              edit: false,
            });
            toast.error(
              err.response
                ? err.response.data
                : "Some error occured please try later"
            );
            console.log(err);
            this.setState({ loadingDayEvents: false });
          });
      } else {
        this.setState({ loadingDayEvents: false });
        addNewEvent(user.token, values)
          .then((res) => {
            let eventToAdd = res.data;
            eventToAdd.date = moment(eventToAdd.date);
            newEvents.push(eventToAdd);
            for (var i = 0; i < newEvents.length; i++) {
              monthEvents.push(newEvents[i]);
            }
            this.setState({
              selectedMonthEvents: monthEvents,
            });
            this.props.loadEvents();
            this.setState({ loadingDayEvents: false });
          })
          .catch((err) => {
            toast.error(
              err.response
                ? err.response.data
                : "Some error occured please try later"
            );
            console.log(err);
            this.setState({ loadingDayEvents: false });
          });
      }
    } else
      toast.error("Invalid Timings or An event must be of atleast 3 hours");
  }

  initialiseEvents() {
    const monthEvents = this.state.selectedMonthEvents;
    const allTheEventsFromDB = this.state.allEvents;

    allTheEventsFromDB.forEach((each) => {
      monthEvents.push(each);
    });

    this.setState({
      selectedMonthEvents: monthEvents,
    });
  }

  render() {
    const currentMonthView = this.state.selectedMonth;
    const currentSelectedDay = this.state.selectedDay;
    const showEvents = this.state.showEvents;
    const showDialog = this.state.showDialog;
    const showEventDialog = this.state.showEventDialog;

    if (showEvents) {
      return (
        <section className="main-calendar">
          {showDialog && (
            <div className="input-dialog-box">
              <div className="dialog-card">
                <div className="dialog-header">
                  <h6>{this.renderDayLabel()} </h6>
                  <i
                    className="box arrow fa fa-times"
                    onClick={this.hideDialog}
                  />
                </div>
                <div className="dialog-body">
                  <AddEventForm
                    handleSubmit={this.handleSubmit}
                    editEvent={this.state.editEvent}
                    members={this.state.members}
                  />
                </div>
              </div>
            </div>
          )}
          {showEventDialog && (
            <div className="event-dialog-box">
              <div className="event-dialog-card">
                <div className="event-dialog-header">
                  <div>
                    <button
                      onClick={this.editEventHandle}
                      className="btn cust-btn"
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={this.removeEvent}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <i
                      className="box arrow fa fa-times"
                      onClick={this.hideDialog}
                    />
                  </div>
                </div>
                <div
                  style={{ marginTop: "20px" }}
                  className="event-dialog-body"
                >
                  <h2>{this.state.viewEvent.title}</h2>
                </div>
              </div>
            </div>
          )}
          <header className="calendar-header">
            <div className="title-header">{this.renderDayLabel()}</div>
            <div className="button-container">
              <i
                className="box arrow fa fa-angle-left"
                onClick={this.showCalendar}
              />
              <i
                className="box event-button fa fa-plus-square"
                onClick={this.showDialog}
              />
            </div>
          </header>
          <Events
            selectedMonth={this.state.selectedMonth}
            selectedDay={this.state.selectedDay}
            selectedMonthEvents={this.state.selectedMonthEvents}
            showEventDialog={(event, i) => this.showEventDialog(event, i)}
            loadingDayEvents={this.state.loadingDayEvents}
          />
        </section>
      );
    } else {
      return (
        <section className="main-calendar">
          <header className="calendar-header">
            <div className="title-header">
              <i
                className="box arrow fa fa-angle-left"
                onClick={this.previous}
              />
              <div className="box header-text">
                {this.renderTodayLabel()}
                {this.renderMonthLabel()}
              </div>
              <i className="box arrow fa fa-angle-right" onClick={this.next} />
            </div>
            <DayNames />
          </header>
          <div className="days-container">{this.renderWeeks()}</div>
        </section>
      );
    }
  }
}

class Events extends React.Component {
  render() {
    const currentMonthView = this.props.selectedMonth;
    const currentSelectedDay = this.props.selectedDay;
    const monthEvents = this.props.selectedMonthEvents;
    const showEventDialog = this.props.showEventDialog;
    const loading = this.props.loadingDayEvents;

    const monthEventsRendered = monthEvents.map((event, i) => {
      return (
        <div
          key={event.title}
          className="event-container"
          onClick={() => showEventDialog(event, i)}
        >
          <TransitionGroup component="div" className="animated-title">
            <div className="event-title event-attribute">{event.title}</div>
          </TransitionGroup>
        </div>
      );
    });

    const dayEventsRendered = [];

    for (var i = 0; i < monthEventsRendered.length; i++) {
      if (monthEvents[i].date.isSame(currentSelectedDay, "day")) {
        dayEventsRendered.push(monthEventsRendered[i]);
      }
    }

    return (
      <div className="day-events">
        {loading ? <h1>loading day events</h1> : dayEventsRendered}
      </div>
    );
  }
}

class DayNames extends React.Component {
  render() {
    return (
      <div className="days-header">
        <span className="box day-name">Mon</span>
        <span className="box day-name">Tue</span>
        <span className="box day-name">Wed</span>
        <span className="box day-name">Thu</span>
        <span className="box day-name">Fri</span>
        <span className="box day-name">Sat</span>
        <span className="box day-name">Sun</span>
      </div>
    );
  }
}

class Week extends React.Component {
  render() {
    let days = [];
    let date = this.props.previousCurrentNextView;
    let currentMonthView = this.props.currentMonthView;
    let selected = this.props.selected;
    let select = this.props.select;
    let monthEvents = this.props.monthEvents;

    for (var i = 0; i < 7; i++) {
      var dayHasEvents = false;

      for (var j = 0; j < monthEvents.length; j++) {
        if (monthEvents[j].date.isSame(date, "day")) {
          dayHasEvents = true;
        }
      }

      let day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === currentMonthView.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date,
        hasEvents: dayHasEvents,
      };

      days.push(<Day day={day} selected={selected} select={select} />);
      date = date.clone();
      date.add(1, "d");
    }
    return <div className="row week">{days}</div>;
  }
}

class Day extends React.Component {
  render() {
    let day = this.props.day;
    let selected = this.props.selected;
    let select = this.props.select;

    return (
      <div
        className={
          "day" +
          (day.isToday ? " today" : "") +
          (day.isCurrentMonth ? "" : " different-month") +
          (day.date.isSame(selected) ? " selected" : "") +
          (day.hasEvents ? " has-events" : "")
        }
        onClick={() => select(day)}
      >
        <div className="day-number">{day.number}</div>
      </div>
    );
  }
}
