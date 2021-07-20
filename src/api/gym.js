import axios from "axios";

export const getCountriesAndCities = async () => {
    return await axios.get('https://countriesnow.space/api/v0.1/countries/')
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