import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrDisplayAttendance, markAbsent, markPresent } from '../../api/attendance';
import { AddMemberForm, AdminNav } from '../../components';

const Attendance = () => {
    const { user } = useSelector(state => ({ ...state }))
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState([])
    const [aid, setAid] = useState('')
    const startDate = new Date().setHours(0, 0, 0, 0)
    const startToday = new Date(startDate)

    // useEffect(() => {
    //     if (members.length)
    //         console.log(members)
    // }, [members])

    const filterMember = ({ present, absent }) => {
        return new Promise((resolve, reject) => {
            let members = []
            present.map(each => {
                members.push({ user: each, attendance: true })
            })
            absent.map(each => {
                members.push({ user: each, attendance: false })
            })
            resolve(members)
        })
    }

    useEffect(() => {
        createOrDisplayAttendance(user.token, new Date(), startToday)
            .then(async res => {
                setAid(res.data._id)
                const resultMems = await filterMember(res.data)
                setMembers(resultMems)
                setLoading(false);
            })
            .catch((err) => {
                // setLoading(false);
                toast.error(err.response ? err.response.data : 'Some error occured please try later');
                console.log(err);
            });
    }, [])

    async function handleToggle(e) {
        try {
            const updatedMembers = members.map((item, i) => {
                if (this === i) {
                    const updatedItem = {
                        ...item,
                        attendance: e.target.checked,
                    };
                    return updatedItem;
                }
                return item;
            });

            if (e.target.checked)
                await markPresent(aid, members[this].user._id, user.token)
            else
                await markAbsent(aid, members[this].user._id, user.token)
            setMembers(updatedMembers)
        } catch (error) {
            console.log(error.message)
        }
    }

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
                                <div className='attendance'>
                                    {
                                        members.length ? (members.map((each, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="member-attendance">
                                                <h5>{each.user.name}</h5>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={each.attendance} onChange={handleToggle.bind(i)} />
                                                </div>
                                            </div>
                                        ))
                                        ) : ''
                                    }
                                </div>
                                {/* <AddMemberForm /> */}
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Attendance;