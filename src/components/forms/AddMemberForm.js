import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addMember } from '../../api/gym';

const AddMemberForm = () => {
    const initialVals = {
        name: 'name',
        phone: 192983,
        email: 's@s.co',
        DOB: ''
    }
    const today = new Date()
    const { user } = useSelector(state => ({ ...state }))
    const [values, setValues] = useState(initialVals)

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault()
        addMember(values, user.token)
            .then(res => {
                toast.success(res.data);
            })
            .catch((err) => {
                // setLoading(false);
                toast.error(err.response ? err.response.data : 'Some error occured please try later');
                console.log(err);
            });
    }

    return (
        <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }} onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name" className="form-label">Full name</label>
                <input type="text" name='name' value={values.name} className="form-control" id="name" onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" name='email' value={values.email} className="form-control" id="exampleInputEmail1" onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="exampleInputPassword1" className="form-label">Phone</label>
                <input type="number" name='phone' value={values.phone} className="form-control" id="exampleInputPassword1" onChange={handleChange} required />
            </div>
            <div>
                <label className="form-date-label" htmlFor="DOB-member">D.O.B</label>
                <input type="date" name='DOB' value={values.DOB} className="form-date-input" id="DOB-member" max={`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default AddMemberForm;