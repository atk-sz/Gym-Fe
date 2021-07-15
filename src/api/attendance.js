import axios from "axios";

export const createOrDisplayAttendance = async (authtoken, today, startToday) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/attendance/create-display`,
        { today, startToday },
        {
            headers: {
                authtoken,
            },
        }
    );
};