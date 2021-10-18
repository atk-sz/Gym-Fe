import axios from "axios";
import moment from "moment";

export const addNewEvent = async (authtoken, newEvent) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/event/new`,
    { newEvent },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const loadAllEvents = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}/events`, {
    headers: {
      authtoken,
    },
  });
};

export const loadEventsPerWeek = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/events/per-week`,
    {
      startDate: new Date(
        new Date(moment().startOf("week").format("YYYY-MM-DD")).setHours(
          0,
          0,
          0,
          0
        )
      ),
      endDate: new Date(
        new Date(moment().endOf("week").format("YYYY-MM-DD")).setHours(
          0,
          0,
          0,
          0
        )
      ),
    },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const removeServerEvent = async (authtoken, event_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_BACKEND_API}/event/${event_id}/delete`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const updateServerEvent = async (authtoken, event_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_BACKEND_API}/event/${event_id}/edit`,
    {
      values,
    },
    {
      headers: {
        authtoken,
      },
    }
  );
};
