import axios from "axios";

export const checkToLogin = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/check/user-member`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}/currentUser`, {
    headers: {
      authtoken,
    },
  });
};

export const currentTeacher = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/currentTeacher`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API}/currentAdmin`, {
    headers: {
      authtoken,
    },
  });
};

export const currentSuperAdmin = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/currentSuperAdmin`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdminOrManager = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/currentAdminOrManager`,
    {
      headers: {
        authtoken,
      },
    }
  );
};