import axios from "axios";

export const addDuration = async (authtoken, value, gid) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API}/duration/${gid}/add`,
    { value },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const removeDuration = async (authtoken, value, gid) => {
  return await axios.put(
    `${process.env.REACT_APP_BACKEND_API}/duration/${gid}/remove`,
    { value },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getDuratoins = async (authtoken, gid) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/durations/${gid}`,
    {
      headers: {
        authtoken,
      },
    }
  );
};
