import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../store/AppContext";

const ProfileForm = () => {
    const [{ user }] = useContext(AppContext);
    const [photo, setPhoto] = useState('');
    const [, dispatch] = useContext(AppContext);

    const handleUpdate = async () => {
        const { id } = user;

        const { data } = await axios.put(`http://localhost:8000/users`, { id, photo });
        dispatch({
            type: "SET_GENERAL_STATE",
            payload: {
                user: data.user,
            },
        });
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
        <div className={'flex pt-1/2 px-12 items-center justify-center'}>
            <div className={'flex-1 w-full flex flex-col items-center relative'}>
                <img
                    className={'w-40 h-40 rounded-full'}
                    src={user.photo || 'emptyProfileIcon.jpeg'}
                />
                <label
                    htmlFor="photo"
                    className={'mt-6 text-sm text-blue-500 cursor-pointer underline decoration-blue-500'}
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
        </div>
    );
}

export default ProfileForm;