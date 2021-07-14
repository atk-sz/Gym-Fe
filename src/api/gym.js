import axios from "axios";

export const addMember = async (values, authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/gym/add/member`,
        { values },
        {
            headers: {
                authtoken,
            },
        }
    );
};