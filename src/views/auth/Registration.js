import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerGymAndUser, validateRegistrationLink } from '../../api/registration';
import { RegistrationForm } from '../../components';
import { auth, projectStorage } from '../../firebase';

const Registration = () => {
    const initialVals = {
        name: '',
        logo: '',
        phone: '',
        email: '',
        images: [],
        docs: [],
    }
    const { user } = useSelector(state => state)
    const { token } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const [values, setValues] = useState(initialVals)
    const [loading, setLoading] = useState(true)
    const [docs, setDocs] = useState([])
    const [images, setImages] = useState([])
    const [image, setImage] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [sameEmail, setSameEmail] = useState(true)
    const [password, setPassword] = useState('password')

    useEffect(() => {
        validateRegistrationLink(token)
            .then(res => {
                setEmail(res.data)
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
                setLoading(false)
                toast.error(error.response ? error.response.data : 'Some error occured please try again later');
                history.push('/')
            })
    }, [token])

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const checkFiles = files => {
        return new Promise((resolve, reject) => {
            const newFiles = []
            for (let i = 0; i < files.length; i++) {
                if (files[i])
                    newFiles.push(files[i])
                else
                    reject([])
            }
            resolve(newFiles)
        })
    }

    const handleImagesSelect = async e => {
        if (e.target.files.length > 0 && e.target.files.length <= 3) {
            checkFiles(e.target.files)
                .then(res => {
                    setImages(res)
                })
                .catch(err => {
                    toast.error('Unsupported media')
                })
        } else if (e.target.files.length > 3) {
            toast.error('Cannot select more then 3 files')
        }
    }

    const uploadImages = () => {
        return new Promise((resolve, reject) => {
            try {
                let localPhotos = []
                images.forEach(eachFile => {
                    let storageRef = projectStorage.ref('/Gym/' + email + '/images/' + eachFile.name)
                    storageRef.put(eachFile).on('state_changed',
                        null,
                        err => console.log(err),
                        async () => {
                            localPhotos.push(await storageRef.getDownloadURL())
                            if (localPhotos.length >= images.length)
                                resolve(localPhotos)
                        })
                })
            } catch (error) {
                reject(error)
            }
        })
    }


    const handleDocsSelect = async e => {
        if (e.target.files.length > 0 && e.target.files.length <= 3) {
            checkFiles(e.target.files)
                .then(res => {
                    setDocs(res)
                })
                .catch(err => {
                    toast.error('Unsupported media')
                })
        } else if (e.target.files.length > 3) {
            toast.error('Cannot select more then 3 files')
        }
    }

    const uploadDocs = () => {
        return new Promise((resolve, reject) => {
            try {
                let localDocs = []
                docs.forEach(eachFile => {
                    let storageRef = projectStorage.ref('/Gym/' + email + '/docs/' + eachFile.name)
                    storageRef.put(eachFile).on('state_changed',
                        null,
                        err => console.log(err),
                        async () => {
                            localDocs.push(await storageRef.getDownloadURL())
                            if (localDocs.length >= docs.length)
                                resolve(localDocs)
                        })
                })
            } catch (error) {
                toast.error('Unsupported media')
                reject(error)
            }
        })
    }

    const handleLogoSelect = e => {
        if (e.target.files[0])
            setImage(e.target.files[0])
    }

    const uploadImage = () => {
        return new Promise((resolve, reject) => {
            try {
                let storageRef = projectStorage.ref('/Gym/' + email + '/logo/' + image.name)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            values.logo = await uploadImage()
            values.images = await uploadImages()
            values.docs = await uploadDocs()
            if (sameEmail)
                values.email = email
            const resultingUser = await auth.createUserWithEmailAndPassword(email, password)
            const idTokenResult = await resultingUser.user.getIdTokenResult();
            const res = await registerGymAndUser(values, username, token)
            setLoading(false)
            setValues(initialVals)
            setImage('')
            setImages([])
            setDocs([])
            toast.success(res.data)
            dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                    token: idTokenResult.token,
                    _id: res.data._id,
                },
            });
            history.push('/user/dashboard');
        } catch (error) {
            setLoading(false)
            if (error.response)
                toast.error(error.response.data)
            else if (error.message)
                toast.error(error.message)
            else
                toast.error('Some error occured please try again later');
            console.log(error);
        }
    };

    return (
        <div style={{ padding: '5vh 30vw' }} className='registration-div'>
            {
                loading ? <h1>...loading</h1> : (
                    <>
                        <h4 style={{ textAlign: 'center' }}>Please Fill The Registration Form</h4>
                        <RegistrationForm
                            handleChange={handleChange}
                            handleImagesSelect={handleImagesSelect}
                            handleDocsSelect={handleDocsSelect}
                            handleLogoSelect={handleLogoSelect}
                            handleSubmit={handleSubmit}
                            values={values}
                            setUsername={setUsername}
                            username={username}
                            sameEmail={sameEmail}
                            setSameEmail={setSameEmail}
                            email={email}
                            setPassword={setPassword}
                            password={password}
                        />
                    </>
                )
            }
        </div>
    );
};

export default Registration;