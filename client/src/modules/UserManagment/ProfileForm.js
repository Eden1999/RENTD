import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../store/AppContext";
import { useNavigate } from "react-router";
import { formatCardNumber } from 'creditcardutils'
import useToken from "../../helpers/useToken";
import { toast } from "react-toastify";
const ProfileForm = () => {
    const navigate = useNavigate();
    const [{ user }] = useContext(AppContext);
    const [, dispatch] = useContext(AppContext);
    const { token } = useToken();
    const [photo, setPhoto] = useState(user.photo);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [cardNumber, setCardNumber] = useState("");
    const [expirationMonth, setExpirationMonth] = useState("");
    const [expirationYear, setExpirationYear] = useState("");

    const handleSave = () => {
        const { id } = user;

        axios.put(`${process.env.REACT_APP_SERVER_URL}users`,
            { email, username, photo, cardNumber, expirationMonth, expirationYear }, {
            headers: {
                token
            }
        }).then((res) => {
            const data = res.data;
            if (data.updatedValues.length == 0) return;
            
            toast.success(data.message, {
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true
            });
            dispatch({
                type: "SET_GENERAL_STATE",
                payload: {
                    user: res.data.user,
                },
            });
        }).catch((e) => {

            toast.error(e.response.data.message, {
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true
            });
        });
    };

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
        <div className={'md:w-3/4 lg:w-1/2 xl:w-1/2 2xl:w-1/2 h-full'}>
            <div className="mb-12 self-center">
                <span className="font-semibold self-center text-6xl text-primary">
                    Edit Profile
                </span>
            </div>
            <div className={'flex pt-1/2 space-x-2'}>
                <div className={'flex !w-1/4 flex-col items-center mt-16 relative'}>
                    <img
                        className={'w-32 h-32 rounded-full'}
                        src={photo || 'emptyProfileIcon.jpeg'}
                    />
                    <label htmlFor="photo"
                        className={'btn btn-primary btn-sm mt-4'}>
                        Choose photo
                    </label>
                    <input
                        type="file"
                        id="photo"
                        accept=".jpeg, .png, .jpg"
                        className={'h-0 w-0'}
                        onChange={handlePhotoUpload}
                    />
                </div>
                <div className={'flex-1 !w-1/2'}>
                    <div>
                        <label className="block mb-2 text-lg !justify-left font-medium text-primary">
                            Email Address
                        </label>
                        <input className="input input-bordered 2xl:select-md font-normal w-full text-secondary"
                            required
                            value={email}
                            placeholder="Enter email..."
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className={"mt-5"}>
                        <label className="block mb-2 text-lg !justify-left font-medium text-primary">
                            Username
                        </label>
                        <input className="input input-bordered 2xl:select-md font-normal w-full text-secondary"
                            value={username}
                            placeholder="Enter username..."
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="flex mt-4 select-none justify-between">
                        <div className="w-full">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Card Number
                            </label>
                            <input className="input input-bordered 2xl:select-md font-normal w-full text-secondary"
                                placeholder={'XXXX XXXX XXXX XXXX'}
                                value={formatCardNumber(cardNumber)}
                                onChange={(e) => { setCardNumber(e.target.value) }}
                            />
                        </div>
                        <div className="ml-6">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Expiration
                            </label>
                            <div className="flex">
                                <div className="w-1/2">
                                    <input
                                        minLength={2}
                                        maxLength={2}
                                        className="input input-bordered 2xl:select-md font-normal w-full text-secondary"
                                        value={expirationMonth.replace(/[^\d]/, '')}
                                        onChange={(e) => { setExpirationMonth(e.target.value) }}
                                        placeholder={'MM'}
                                    />
                                </div>
                                <div className="w-1/2 ml-6">
                                    <input
                                        minLength={2}
                                        maxLength={2}
                                        className="input input-bordered 2xl:select-md font-normal w-full text-secondary"
                                        value={expirationYear.replace(/[^\d]/, '')}
                                        onChange={(e) => { setExpirationYear(e.target.value) }}
                                        placeholder={'YY'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex !justify-center !items-center space-x-2">
                        <button className={'btn btn-primary mt-6 text-sm cursor-pointer decoration-blue-500'}
                            onClick={() => handleSave()}>
                            Save
                        </button>
                        <button className={'btn btn-secondary text-white mt-6 text-sm cursor-pointer decoration-blue-500'}
                            onClick={() => navigate('/reset-password')}>
                            change password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;