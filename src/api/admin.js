import axios from "axios";

export const addManager = async (authtoken, manager) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/admin/add/manager`,
    { manager },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const adminSendMailToMember = async (authtoken, message, email) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/admin/send/mail`,
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

export const getHouseMembers = async (authtoken, hid) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/gym/${hid}/members`,
    {
      headers: {
        authtoken,
      },
    }
  );
};