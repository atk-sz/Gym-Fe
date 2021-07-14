import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrDisplayAttendance } from '../../api/attendance';
import { AddMemberForm, AdminNav } from '../../components';

const Attendance = () => {
    const { user } = useSelector(state => ({ ...state }))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        createOrDisplayAttendance(user.token, new Date())
            .then(res => {
                console.log(res.data)
                setLoading(false);
            })
            .catch((err) => {
                // setLoading(false);
                toast.error(err.response ? err.response.data : 'Some error occured please try later');
                console.log(err);
            });
    }, [])

    return (
        <div className="container-fluid admin-dashboard-div">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10 text-center">
                    {
                        loading ? <h1>..loading</h1> : (
                            <>
                                <h1>Attendance</h1>
                                <div>

                                </div>
                                <AddMemberForm />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Attendance;