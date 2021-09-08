import axios from "axios";

export const sendRegistrationLink = async (email) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/send/registration-link`,
    { email }
  );
};

export const validateRegistrationLink = async (token) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/registration-link/${token}/validate`
  );
};

export const registerGymAndUser = async (values, name, token) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/register/gym-user/${token}`,
    { values, name }
  );
};
