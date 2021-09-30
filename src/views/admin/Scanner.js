import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
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
    const [visible, setVisible] = useState(false)
    const [camVisible, setCamVisible] = useState(false)
    const [searchDisable, setSearchDisable] = useState(false)

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
            setLoading(false);
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
            setLoadingLogs(true)
            const res = await getLogs(user.token, aid)
            sortAndSave(res.data.log_book)
        } catch (error) {
            toast.error(
                error.response
                    ? error.response.data
                    : "Some error occured please try later"
            );
            console.log(error);
        }
    }

    const sortAndSave = (logs) => {
        logs.sort(function (a, b) {
            return new Date(b.time) - new Date(a.time);
        });
        setLogs(logs)
        setLoadingLogs(false)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            setDisable(true)
            setLoadingLogs(true)
            const res = await checkAndMark(aid, search, user.token)
            setSearch('')
            setDisable(false)
            sortAndSave(res.data.log_book)
        } catch (error) {
            setDisable(false)
            toast.error(
                error.response
                    ? error.response.data
                    : "Some error occured please try later"
            );
            console.log(error);
        }
    }

    const displayTime = (date) => {
        const dateAndTime = new Date(date);
        return `${dateAndTime.getHours()} : ${dateAndTime.getMinutes()}`;
    };

    const filteredMembers = members.filter((each) =>
        each.card_id.toLocaleLowerCase().includes((search.toLocaleLowerCase()))
    );

    const membersToSuggest = search ? filteredMembers : [];

    const handleScan = async (err, result) => {
        if (result) {
            setSearch(result.text)
            setDisable(true)
            setSearchDisable(true)
            setCamVisible(false)
            setLoadingLogs(true)
            const res = await checkAndMark(aid, result.text, user.token)
            setSearch('')
            setDisable(false)
            setSearchDisable(false)
            sortAndSave(res.data.log_book)
        }
    }

    return (
        <div className="scanner-page-div">
            {camVisible && (<div className="barcode-webcam-div">
                <BarcodeScannerComponent
                    width={500}
                    height={500}
                    onUpdate={handleScan}
                />
            </div>)}
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
                                        onChange={e => { setSearch(e.target.value); setVisible(true) }}
                                        className="form-control"
                                        id="ID"
                                        aria-describedby="idHelp"
                                        autoFocus
                                        disabled={searchDisable}
                                    // required
                                    />
                                    {
                                        membersToSuggest.length ? (<div className={`suggesstion-div ${visible ? 'visible' : ''}`}>
                                            {
                                                membersToSuggest.map((each, i) => {
                                                    if (i < 5)
                                                        return (<h3 key={i} onClick={e => { setSearch(each.card_id); setVisible(false) }} className="suggesstion">{each.card_id}</h3>)
                                                })
                                            }
                                        </div>) : ''
                                    }
                                    <div id="idHelp" className="form-text">Please enter the entire Id of the member</div>
                                </div>
                                <div className="col-sm">
                                    <button
                                        type="submit"
                                        disabled={disable}
                                        className="btn btn-primary">
                                        Mark
                                    </button>
                                </div>
                            </div>
                        </form>
                        <h3>Or</h3>
                        <div className="scanner-webcam-btn-div">
                            <button onClick={e => setCamVisible(true)} className="btn btn-primary"> Scan</button>
                        </div>
                        {
                            loadingLogs ? (<div style={{ textAlign: "center" }} colSpan="5">
                                <ScaleLoader />
                            </div>) : (
                                <div className="log-book-div">
                                    <div className="log-book-header">
                                        <h4>Card Id</h4>
                                        <h4>Action</h4>
                                        <h4>Time</h4>
                                    </div>
                                    {
                                        logs.length ? logs.map((each, i) =>
                                        (<div className="primary" key={i} className="log-book-records">
                                            <h3>{each.member}</h3>
                                            <h3>{each.action}</h3>
                                            <h3>{displayTime(each.time)}</h3>
                                        </div>)) : ''
                                    }
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};

export default Scanner;