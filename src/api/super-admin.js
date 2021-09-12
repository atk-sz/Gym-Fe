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

export const getAllGyms = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}/gyms`, {
    headers: {
      authtoken,
    },
  });
};

export const getGymStats = async (authtoken, gym_id) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/gym/${gym_id}/stats`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const superAdminSendMailToMember = async (authtoken, message, email) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/super-admin/send/mail`,
    {
      message,
      email,
    },
    {
      headers: {
        authtoken,
      },
    }
  );
};
