import axios from "axios";

export const getPendingReqs = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/get/pending/requests`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};