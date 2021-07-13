import React, { useEffect, useState } from 'react';
import { SuperNav } from '../../components';

const SuperAdminDashboard = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <div className="container-fluid superadmin-dashboard-div">
            <div className="row">
                <div className="col-md-2">
                    <SuperNav />
                </div>
                <div className="col-md-10 text-center">
                    {
                        loading ? <h1>..loading</h1> : (
                            <>
                                <h1>Super admin dahboard</h1>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );;
};

export default SuperAdminDashboard;