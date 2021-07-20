import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addMember, getCountriesAndCities } from '../../api/gym';
import { projectStorage } from '../../firebase';


// DOB: '',
// join: '',
// expire: '',

const AddMemberForm = () => {
    const initialVals = {
        fname: 'f-name',
        lname: 'l-name',
        phone: 1234567,
        email: 'member1@g.com',
        profile: 'https://www.computerhope.com/jargon/g/guest-user.jpg',
        DOB: '',
        join: '',
        expire: '',
        address: {
            first_line: 'address first line',
            second_line: '',
            city: '',
            pincode: 123,
            country: '',
        },
    }
    const today = new Date()
    const { user } = useSelector(state => ({ ...state }))
    const [values, setValues] = useState(initialVals)
    const [loading, setLoading] = useState(true)
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [loadingCities, setLoadingCities] = useState(true)
    const [image, setImage] = useState('')

    useEffect(() => {
        getCountriesAndCities()
            .then(res => {
                setCountries(res.data.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleAddressChange = e => {
        let { address } = values;
        setValues({ ...values, address: { ...address, [e.target.name]: e.target.value } })
    }

    const handleCityChange = city => {
        let { address } = values;
        address.city = city
        setValues({ ...values, address })
    }

    const handleCountryChange = country => {
        let { address } = values;
        address.country = country
        setValues({ ...values, address })
    }

    const handleCountrySelect = async e => {
        setLoadingCities(true)
        if (e.target.value !== 'Please select the country') {
            try {
                const country = countries.filter(each => (each.country === e.target.value))
                setCities(country[0].cities)
                handleCountryChange(e.target.value)
                handleCityChange('')
                setLoadingCities(false)
            } catch (error) {
                console.log(error)
            }
        } else {
            handleCountryChange('')
            setCities([])
            handleCityChange('')
        }
    }

    const handleCitySelect = async e => {
        if (e.target.value !== 'Please select the city') {
            try {
                handleCityChange(e.target.value)
            } catch (error) {
                console.log(error)
            }
        } else {
            handleCityChange('')
        }
    }

    const handleImageSelect = async e => {
        if (e.target.files) {
            setImage(e.target.files)
        } else {
            setImage('')
            toast.error('Please select valid doc')
        }
    }

    const uploadImage = () => {
        return new Promise((resolve, reject) => {
            try {
                let storageRef = projectStorage.ref('/Gym/' + user._id + '/Member/Profile' + image.name)
                storageRef.put(image).on('state_changed',
                    null,
                    err => console.log(err),
                    async () => {
                        resolve(await storageRef.getDownloadURL())
                    })
            } catch (error) {
                reject(error)
            }
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true);
            if (image)
                values.profile = await uploadImage()
            const res = await addMember(values, user.token)
            toast.success(res.data);
            setValues(initialVals)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.response ? error.response.data : 'Some error occured please try later');
            console.log(error);
        }
    }

    return (<>
        {
            loading ? <h1>loading</h1> : (
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} class="mb-3">
                        <div className="fn">
                            <label htmlFor="fname" class="form-label">First Name</label>
                            <input type="text" name='fname' value={values.fname} className="form-control" id="fname" onChange={handleChange} />
                        </div>
                        <div className="ln">
                            <label htmlFor="lname" class="form-label">Last Name</label>
                            <input type="text" name='lname' value={values.lname} className="form-control" id="lname" onChange={handleChange} />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="number" name='phone' value={values.phone} className="form-control" id="phone" onChange={handleChange} />
                    </div>
                    <div class="mb-3">
                        <label htmlFor="email" class="form-label">Email address</label>
                        <input type="email" name='email' value={values.email} className="form-control" id="email" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="photos" className="form-label">Upload Profile Image</label>
                        <input type="file" id='photos' name="photos" accept="image/*" className="form-control" onChange={handleImageSelect} />
                    </div>
                    <div className="mb-3">
                        <label className="form-date-label" htmlFor="DOB-member">Date Of Birth</label>
                        <input type="date" name='DOB' value={values.DOB} className="form-control" id="DOB-member" onChange={handleChange} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
                        <div className="member-joining-date">
                            <label className="form-date-label" htmlFor="join-member">Joining</label>
                            <input type="date" name='join' value={values.join} className="form-control" id="join-member" onChange={handleChange} />
                        </div>
                        <div className="member-expire-date">
                            <label className="form-date-label" htmlFor="expire-member">Valid Till</label>
                            <input type="date" name='expire' value={values.expire} className="form-control" id="expire-member" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Address</label>
                        <input type="text" value={values.address.first_line} name="first_line" className="form-control mb-3" id="name" onChange={handleAddressChange} />
                        <input type="text" value={values.address.second_line} name="second_line" className="form-control" id="name" onChange={handleAddressChange} />
                    </div>
                    {
                        countries && (
                            <select onChange={handleCountrySelect} name="country" className="form-select mb-3" value={values.address.country} >
                                <option defaultValue>Please select the country</option>
                                {
                                    countries.map((each, i) => (
                                        <option key={i} value={each.country}>{each.country}</option>
                                    ))
                                }
                            </select>
                        )
                    }
                    {
                        cities && (
                            <select className="form-select mb-3" name="city" disabled={loadingCities} onChange={handleCitySelect} value={values.address.city} >
                                <option defaultValue>Please select the city</option>
                                {
                                    cities.map((each, i) => (
                                        <option key={i} value={each}>{each}</option>
                                    ))
                                }
                            </select>
                        )
                    }
                    <div className="mb-3">
                        <label htmlFor="pincode" className="form-label">Pincode</label>
                        <input type="Number" name="pincode" className="form-control mb-3" id="pincode" onChange={handleAddressChange} value={values.address.pincode} />
                    </div>
                    <button type="submit" className="btn btn-primary float-end">Submit</button>
                </form>
            )
        }
    </>);
};

export default AddMemberForm;