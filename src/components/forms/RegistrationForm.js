import React from 'react';

// const initialVals = {
//     : '',
//     : '',
//     phone: '',
//     images: [],
//     docs: [],
// }

const RegistrationForm = ({
    handleChange,
    handleImagesSelect,
    handleDocsSelect,
    handleLogoSelect,
    handleSubmit,
    values,
    setUsername,
    username,
    sameEmail,
    setSameEmail,
    email,
    setPassword,
    password
}) => {
    return (
        <form className='registration-form' onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Your Name</label>
                <input type="text" name='username' value={username} className="form-control" id="username" onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Gym Name</label>
                <input type="text" name='name' value={values.name} className="form-control" id="name" onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="logo" className="form-label">Upload Logo</label>
                <input type="file" id='logo' name="logo" accept="image/*" onChange={handleLogoSelect} />
            </div>
            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="Number" name="phone" className="form-control" id="phone" onChange={handleChange} value={values.phone} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" name='email' value={sameEmail ? email : values.email} onChange={handleChange} id="exampleInputEmail1" aria-describedby="emailHelp" disabled={sameEmail} required />
                <div id="emailHelp" className="form-text">Use different email for your gym
                    <input className='float-end' value={sameEmail} onChange={e => setSameEmail(!sameEmail)} type="checkbox" name="sameEmailCheck" />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="PAN_upload" className="form-label">Upload PAN</label>
                <input type="file" id='PAN_upload' name="PAN_upload" accept="application/pdf" onChange={handleDocsSelect} multiple />
            </div>
            <div className="mb-3">
                <label htmlFor="photos" className="form-label">Upload Images of your store</label>
                <input type="file" id='photos' name="photos" accept="image/*" onChange={handleImagesSelect} multiple />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default RegistrationForm;