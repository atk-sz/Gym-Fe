import axios from "axios";

export const getCountriesAndCities = async () => {
    return await axios.get('https://countriesnow.space/api/v0.1/countries/')
};

export const getGymDetails = async (authtoken) => {
    return await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/gym`,
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const updateGymLogo = async (authtoken, id, logo) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/gym/${id}/update-logo`,
        {
            logo
        },
        {
            headers: {
                authtoken,
            },
        }
    );
};

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

export const weeklyStats = async (authtoken, gid, dateToday) => {
    return await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/gym/${gid}/weekly/stats`,
        {
            today: dateToday
        },
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const getAllGymMembers = async (authtoken) => {
    return await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/gym/members/all`,
        {
            headers: {
                authtoken,
            },
        }
    );
};