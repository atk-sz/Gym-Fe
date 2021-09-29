import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { checkAndMark, createOrDisplayAttendance, getLogs } from '../../api/attendance';
import './styles/Scanner.css'

const Scanner = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [aid, setAid] = useState("");
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('')
    const dateToday = new Date(new Date().setHours(0, 0, 0, 0));
    const [disable, setDisable] = useState(true)

    const filterMember = ({ absent, log }) => {
        return new Promise((resolve, reject) => {
            let members = [];
            log.map((each) => {
                members.push({
                    user: each.member,
                    card_id: each.member.card_id,
                    checkin: true,
                    checkout: each.checkout ? true : false,
                });
            });
            absent.map((each) => {
                members.push({ user: each, card_id: each.card_id, checkin: false, checkout: false });
            });
            resolve(members);
        });
    };

    useEffect(async () => {
        try {
            const res = await createOrDisplayAttendance(user.token, dateToday)
            setAid(res.data._id)
            const resultMems = await filterMember(res.data);
            setMembers(resultMems);
            loadLogs(res.data._id)
        } catch (error) {
            toast.error(
                error.response
                    ? error.response.data
                    : "Some error occured please try later"
            );
            console.log(error);
        }
    }, [])

    useEffect(() => {
        if (search.trim()) {
            const i = members.findIndex(_item => _item.card_id === search);
            if (i > 0)
                setDisable(false)
            else
                setDisable(true)
        } else
            setDisable(true)
    }, [search])

    const loadLogs = async (aid) => {
        try {
            const res = await getLogs(user.token, aid)
            console.log(res.data)
            setLoading(false);
        } catch (error) {
            toast.error(
                error.response
                    ? error.response.data
                    : "Some error occured please try later"
            );
            console.log(error);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await checkAndMark(aid, search, user.token)
            console.log(res.data)
        } catch (error) {
            toast.error(
                error.response
                    ? error.response.data
                    : "Some error occured please try later"
            );
            console.log(error);
        }
    }

    const filteredMembers = members.filter((each) =>
        each.card_id.toLocaleLowerCase().includes((search.toLocaleLowerCase()))
    );

    const membersToSuggest = search ? filteredMembers : [];

    return (
        <div>
            {
                loading ? (<div style={{ textAlign: "center" }} colSpan="5">
                    <ScaleLoader />
                </div>) : (
                    <>
                        <form onSubmit={handleSubmit} className="search-member">
                            <div style={{ position: 'relative' }} className="row g-2">
                                <div className="col-sm-8">
                                    <label htmlFor="ID" className="form-label">Member ID</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="form-control"
                                        id="ID"
                                        aria-describedby="idHelp"
                                        autoFocus
                                    // required
                                    />
                                    {
                                        membersToSuggest.length ? (<div className="suggesstion-div">
                                            {
                                                membersToSuggest.map((each, i) => {
                                                    if (i < 5)
                                                        return (<h3 key={i} onClick={e => setSearch(each.card_id)} className="suggesstion">{each.card_id}</h3>)
                                                })
                                            }
                                        </div>) : ''
                                    }
                                    <div id="idHelp" className="form-text">Please enter the entire Id of the member</div>
                                </div>
                                <div className="col-sm">
                                    <button
                                        type="submit"
                                        // disabled={disable}
                                        className="btn btn-primary">
                                        Mark
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                )
            }
        </div>
    );
};

export default Scanner;