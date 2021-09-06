import axios from "axios";

export const statusCheck = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/user/gym/status`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const reSubmit = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/user/gym/re-submit`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};
