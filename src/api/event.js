import axios from "axios";

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
      values
    },
    {
      headers: {
        authtoken,
      },
    }
  );
};
