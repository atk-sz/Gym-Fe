import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reSubmit, statusCheck } from "../../api/user";

const UserDashboard = ({ history }) => {
  const { user } = useSelector(state => ({ ...state }))
  const [loading, setLoading] = useState(true)
  const [editAble, setEditAble] = useState(false)
  const [text, setText] = useState('Please Wait Untill Your Gym is approved')

  useEffect(() => {
    statusCheck(user.token)
      .then(res => {
        console.log(res.data)
        setEditAble(res.data.rejected)
        setText(res.data.message)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response ? err.response.data : 'Some error occured please try later');
      })
  }, [])

  const handleClick = e => {
    reSubmit(user.token)
      .then(res => {
        console.log(res.data)
        setEditAble(res.data.rejected)
        setText(res.data.message)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response ? err.response.data : 'Some error occured please try later');
      })
  }

  return (
    <div>
      {
        loading ? <h1>loading</h1> : (
          <>
            <h1>{text}</h1>
            {editAble ? <button type="submit" id="re-submit-btn" onClick={handleClick} className="btn btn-primary">Submit</button> : ''}
          </>
        )
      }
    </div>
  );
};
export default UserDashboard;
