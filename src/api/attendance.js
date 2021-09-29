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

export const markPresent = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/checkin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const markAbsent = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/checkinback`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const markCheckout = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/checkout`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const markCheckoutBack = async (aid, mid, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/checkoutback`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const checkAndMark = async (aid, card_id, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/check-and-mark`,
    { card_id },
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

export const getLogs = async (authtoken, aid) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/logs`,
    {
      headers: {
        authtoken,
      },
    }
  );
};
