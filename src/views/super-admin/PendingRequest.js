import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { approvePendingGym, getPendingGym, rejectPendingGym } from '../../api/super-admin';

const PendingRequest = () => {
    const { id } = useParams()
    const history = useHistory()
    const { user } = useSelector(state => ({ ...state }))
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState({})
    const [displayImage, setDisplayImage] = useState('')

    useEffect(() => {
        loadPendingGymDetails()
    }, [])

    const loadPendingGymDetails = () => {
        getPendingGym(id, user.token)
            .then((res) => {
                console.log(res.data)
                setRequest(res.data)
                setDisplayImage(res.data.logo)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response ? err.response.data : 'Some error occured please try later');
                console.log(err);
            });
    }

    const handleClick = e => {
        setDisplayImage(e.target.src)
    }

    const handleApprove = () => {
        setLoading(true);
        approvePendingGym(id, user.token)
            .then((res) => {
                toast.success(res.data);
                // setLoading(false)
                history.push('/super-admin/pending-requests')
            })
            .catch((err) => {
                setLoading(false);
                console.log(err)
                toast.error(err.response ? err.response.data : 'Some error occured please try later');
                console.log(err);
            });
    }

    const handleReject = () => {
        const confirm = window.prompt();
        if (confirm && confirm.trim()) {
            setLoading(true);
            rejectPendingGym(id, user.token, confirm)
                .then((res) => {
                    toast.success(res.data);
                    // setLoading(false)
                    history.push('/super-admin/pending-requests')
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err.response ? err.response.data : 'Some error occured please try later');
                    console.log(err);
                });
        }
    }

    return (
        <div style={{ margin: 'auto 50px' }} className='pending-gym-detail-div'>
            {
                loading ? <h1>...loading</h1> : (<div style={{ display: 'flex' }}>
                    <div className="images-docs">
                        <div className="images-pending-gym">
                            <div className="display-image">
                                <img style={{ height: '18rem', width: '18rem', marginBottom: '50px' }} src={displayImage} alt={request.name} />
                            </div>
                            <div className="preview-images">
                                {
                                    request.images.map((each, i) => (<img onClick={handleClick} style={{ height: '5rem', width: '7rem', margin: '0 10px 50px 10px' }} key={i} src={each} alt={request.name} />))
                                }
                            </div>
                        </div>
                        <div className="docs-pending-gym">
                            {request.docs.map((each, i) => (<embed key={i} style={{ width: '300px', height: '200px', margin: '10px' }} src={each} type="application/pdf" />))}
                        </div>
                    </div>
                    <div className="gym-details">
                        <h1>{request.name}</h1>

                        <button onClick={handleReject} className='btn btn-danger'>Reject</button>
                        <button onClick={handleApprove} className='btn btn-success'>Approve</button>
                    </div>
                </div>
                )
            }
        </div>
    );
};

export default PendingRequest;