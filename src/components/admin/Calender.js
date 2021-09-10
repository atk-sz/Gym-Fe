import React, { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import moment from "moment";
import "./Calender.css";
import { addNewEvent, loadAllEvents, removeEvent } from "../../api/event";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const MyCalendar = () => {
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
        {loading ? <h1>loading</h1> : <Calendar user={user} events={events} />}
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
      newEventTitle: "",
      newEventDescription: "",
    };

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.goToCurrentMonthView = this.goToCurrentMonthView.bind(this);
    this.initialiseEvents();
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleAdd() {
    let monthEvents = this.state.selectedMonthEvents;
    const currentSelectedDate = this.state.selectedDay;

    let newEvents = [];

    var eventTitle = prompt("Please enter a name for your event: ");

    switch (eventTitle) {
      case "":
        alert("Event name cannot be empty.");
        break;
      case null:
        alert("Changed your mind? You can add one later!");
        break;
      default:
        var newEvent = {
          title: eventTitle,
          date: currentSelectedDate,
        };

        newEvents.push(newEvent);

        for (var i = 0; i < newEvents.length; i++) {
          monthEvents.push(newEvents[i]);
        }

        this.setState({
          selectedMonthEvents: monthEvents,
        });

        break;
    }
  }

  addEvent() {
    const currentSelectedDate = this.state.selectedDay;
    let isAfterDay = moment().startOf("day").subtract(1, "d");

    if (currentSelectedDate.isAfter(isAfterDay)) {
      this.handleAdd();
    } else {
      if (
        window.confirm("Are you sure you want to add an event in the past?")
      ) {
        this.handleAdd();
      } else {
      } // end confirm past
    } //end is in the past
  }

  removeEvent(i) {
    const monthEvents = this.state.selectedMonthEvents.slice();
    const currentSelectedDate = this.state.selectedDay;
    const { user } = this.props;
    let isAfterDay = moment().startOf("day").subtract(1, "d");

    if (currentSelectedDate.isAfter(isAfterDay)) {
      if (window.confirm("Are you sure you want to remove this event?")) {
        let index = i;

        if (index != -1) {
          this.setState({ loadingDayEvents: true });
          removeEvent(user.token, monthEvents[index]._id)
            .then((res) => {
              monthEvents.splice(index, 1);
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

  hideDialog() {
    this.setState({
      showDialog: false,
      newEventTitle: "",
      newEventDescription: "",
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user } = this.props;
    if (
      this.state.newEventTitle.trim() &&
      this.state.newEventDescription.trim()
    ) {
      let monthEvents = this.state.selectedMonthEvents;
      const currentSelectedDate = this.state.selectedDay;

      let newEvents = [];

      const newEvent = {
        title: this.state.newEventTitle.trim(),
        description: this.state.newEventDescription.trim(),
        date: currentSelectedDate,
      };

      this.setState({ loadingDayEvents: true });

      this.hideDialog();

      addNewEvent(user.token, newEvent)
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
    } else window.alert("Both title and description needs to be filled");
  }

  initialiseEvents() {
    const monthEvents = this.state.selectedMonthEvents;
    const allTheEvents = this.state.allEvents;

    let allEvents = [];

    var event1 = {
      createdAt: "2021-08-11T04:47:02.039Z",
      date: moment("2021-08-19T18:30:00.000Z"),
      description: "now",
      gym: "60fed793c674a50a881e3dda",
      title: "Again",
      updatedAt: "2021-08-11T04:47:02.039Z",
      __v: 0,
    };

    var event2 = {
      title: "Event 2 - Meeting",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(17, "d").add(2, "h"),
    };

    var event3 = {
      title: "Event 3 - Cinema",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(7, "d").add(18, "h"),
    };

    var event4 = {
      title: "Event 4 - Theater",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(16, "d").add(20, "h"),
    };

    var event5 = {
      title: "Event 5 - Drinks",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(12, "h"),
    };

    var event6 = {
      title: "Event 6 - Diving",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(13, "h"),
    };

    var event7 = {
      title: "Event 7 - Tennis",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(14, "h"),
    };

    var event8 = {
      title: "Event 8 - Swimmming",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(17, "h"),
    };

    var event19 = {
      title: "Event 19 - Swimmming",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(17, "h"),
    };

    var event20 = {
      title: "Event 20 - Swimmming",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(17, "h"),
    };

    var event9 = {
      title: "Event 9 - Chilling",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").subtract(2, "d").add(16, "h"),
    };

    var event10 = {
      title: "Hello World",
      description:
        "Description sdkldjddjddkandndnnddndndnd  djdjdjjfjfjfjjff dkdjdjddjdkjdk",
      date: moment().startOf("day").add(5, "h"),
    };

    allEvents.push(event1);
    // allEvents.push(event2);
    // allEvents.push(event3);
    // allEvents.push(event4);
    // allEvents.push(event5);
    // allEvents.push(event6);
    // allEvents.push(event7);
    // allEvents.push(event8);
    // allEvents.push(event9);
    // allEvents.push(event19);
    // allEvents.push(event10);
    // allEvents.push(event20);

    allTheEvents.forEach((each) => {
      monthEvents.push(each);
    });

    // for (var i = 0; i < allEvents.length; i++) {
    //     monthEvents.push(allEvents[i]);
    // }

    this.setState({
      selectedMonthEvents: monthEvents,
    });
  }

  render() {
    const currentMonthView = this.state.selectedMonth;
    const currentSelectedDay = this.state.selectedDay;
    const showEvents = this.state.showEvents;
    const showDialog = this.state.showDialog;

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
                  <form onSubmit={this.handleSubmit} className="new-event-form">
                    <div className="mb-3">
                      <label htmlFor="new-title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        value={this.state.newEventTitle}
                        onChange={(e) =>
                          this.setState({ newEventTitle: e.target.value })
                        }
                        className="form-control"
                        id="new-title"
                        aria-describedby="emailHelp"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="new-description" className="form-label">
                        Description
                      </label>
                      <input
                        type="text"
                        value={this.state.newEventDescription}
                        onChange={(e) =>
                          this.setState({ newEventDescription: e.target.value })
                        }
                        className="form-control"
                        id="new-description"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </form>
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
            removeEvent={(i) => this.removeEvent(i)}
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
    const removeEvent = this.props.removeEvent;
    const loading = this.props.loadingDayEvents;

    const monthEventsRendered = monthEvents.map((event, i) => {
      return (
        <div
          key={event.title}
          className="event-container"
          onClick={() => removeEvent(i)}
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
