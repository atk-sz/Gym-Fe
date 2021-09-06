import axios from "axios";

export const createOrDisplayAttendance = async (authtoken, today) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/create-display`,
    { today },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const markAbsent = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/absent`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const markPresent = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/present`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getPresentCount = async (authtoken, aid) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/present/count`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getMemberCount = async (authtoken, aid) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/member/count`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getLogs = async (authtoken, gid) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${gid}/logs`,
    {
      startDate: new Date(),
    },
    {
      headers: {
        authtoken,
      },
    }
  );
};
