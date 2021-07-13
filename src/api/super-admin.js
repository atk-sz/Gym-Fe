import axios from "axios";

export const getPendingReqs = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/get/pending/requests`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getPendingGym = async (id, authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/gym/${id}/pending/details`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const approvePendingGym = async (id, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/gym/${id}/approve`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const rejectPendingGym = async (id, authtoken, message) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/gym/${id}/reject`,
    { message },
    {
      headers: {
        authtoken,
      },
    }
  );
};
