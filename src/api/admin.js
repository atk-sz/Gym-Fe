import axios from "axios";

export const sendInvitations = async (authtoken, id, email) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/admin/${id}/invite`,
    { email },
    {
      headers: {
        authtoken,
      },
    }
  );
};
