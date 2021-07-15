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

export const markAbsent = async (aid, mid, authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/absent`,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const markPresent = async (aid, mid, authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/attendance/${aid}/${mid}/present`,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};