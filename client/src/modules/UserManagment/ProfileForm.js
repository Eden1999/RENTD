import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../store/AppContext";
import {Box, Button, Container, CssBaseline, InputAdornment, TextField, Typography} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {useNavigate} from "react-router";
import {DraftsOutlined} from "@mui/icons-material";

const ProfileForm = () => {
    const navigate = useNavigate();
    const [{user}] = useContext(AppContext);
    const [, dispatch] = useContext(AppContext);
    const [photo, setPhoto] = useState('');
    const [username, setUsername] = useState(user.username);

    const handleUpdate = async () => {
        const {id} = user;

        const {data} = await axios.put(`http://localhost:8000/users`, {id, photo});
        dispatch({
            type: "SET_GENERAL_STATE",
            payload: {
                user: data.user,
            },
        });
    };

    const handleUpdateUsername = async () => {
        const {id} = user;

        await axios.post(`http://localhost:8000/users/update-username`, {id, username});
    };

    useEffect(async () => {
        await handleUpdate();
    }, [photo]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        const base64Photo = await convertToBase64(file);
        setPhoto(base64Photo);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <div className={'flex w-1/2 h-full pt-1/2 px-12 items-center justify-center'}>
            <div className={'flex-1 w-full flex flex-col items-center relative'}>
                <img
                    className={'w-40 h-40 rounded-full'}
                    src={user.photo || 'emptyProfileIcon.jpeg'}
                />
                <label
                    htmlFor="photo"
                    className={'mt-6 text-sm text-blue-500 cursor-pointer decoration-blue-500'}
                >
                    Change profile photo
                </label>
                <input
                    type="file"
                    id="photo"
                    accept=".jpeg, .png, .jpg"
                    className={'h-0 w-0'}
                    onChange={handlePhotoUpload}
                />
            </div>
            <div className={'flex-1 !w-1/2 flex flex-col items-center relative'}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={username}
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(event) => setUsername(event.target.value)}
                />
                <div>
                    <label
                        className={'btn mt-6 mx-2 text-sm cursor-pointer decoration-blue-500'}
                        onClick={() => handleUpdateUsername()}
                    >
                        set username
                    </label>
                    <label
                        className={'btn mt-6 text-sm cursor-pointer decoration-blue-500'}
                        onClick={() => navigate('/reset-password')}
                    >
                        reset password
                    </label>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;