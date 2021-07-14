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