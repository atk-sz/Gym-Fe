import axios from "axios";

export const sendRegistrationLink = async (email) => {
    return await axios.post(`${process.env.REACT_APP_BACKEND_API}/send/registration-link`, { email });
};