import axios from "axios";

export const checkLog = async (aid, mid, authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/member/${aid}/${mid}/checklog`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const checkIn = async (aid, mid, authtoken, actionTime) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/member/${aid}/${mid}/checkin`,
    { actionTime },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const checkOut = async (aid, mid, authtoken, actionTime) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/member/${aid}/${mid}/checkout`,
    { actionTime },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const memberDetails = async (authtoken, mid) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}/member/${mid}`, {
    headers: {
      authtoken,
    },
  });
};

export const validateHouseId = async (hid, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_BACKEND_API}/member/validate-house`,
    { hid }, {
    headers: {
      authtoken,
    }
  });
};