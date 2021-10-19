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

export const getManagers = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/admin/managers`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const adminSendMailToMember = async (
  authtoken,
  message,
  email,
  subject
) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/admin/send/mail`,
    {
      message,
      email,
      subject,
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
