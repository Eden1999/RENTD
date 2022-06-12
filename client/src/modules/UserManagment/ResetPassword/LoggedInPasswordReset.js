import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useToken from "../../../helpers/useToken";
import { useNavigate } from "react-router-dom";

function LoggedInPasswordReset() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const { token, setToken } = useToken();
    const navigate = useNavigate();

    const verifyInputs = () => {
        if (newPassword == "") {
            toast.error('New password cannot be empty!', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
            });
            return false;
        }
        if (newPassword != newPasswordRepeat) {
            toast.error('Passwords do not match!', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
            });
            return false;
        }
        return true;
    }

    const handleSubmit = () => {
        if (!verifyInputs()) return;
        
        axios.post(`${process.env.REACT_APP_SERVER_URL}/users/change-password`, {token, newPassword, currentPassword})
            .then((res) => {
                toast.success("Password successfully changed!", {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true
                });
                navigate('/profile');
            })
            .catch((e) => {
                toast.error(e.response.data.message, {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                });
            });
    }

    return (
        <div className="w-1/3 self-center m-8">
            <div className="mb-12">
                <span className="font-semibold text-6xl text-primary">
                    Change Password
                </span>
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-primary">
                    Current Password
                </label>
                <input type="password"
                    className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                    placeholder={'******'}
                    onChange={(e) => { setCurrentPassword(e.target.value) }}
                />
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-primary">
                    New Password:
                </label>
                <input type="password"
                    className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                    placeholder={'******'}
                    onChange={(e) => { setNewPassword(e.target.value) }}
                />
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-primary">
                    Repeat New Password:
                </label>
                <input type="password"
                    className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                    placeholder={'******'}
                    onChange={(e) => { setNewPasswordRepeat(e.target.value) }}
                />
            </div>

            <div className="flex mb-6 w-full">
                <button type="button" className={"btn btn-lg btn-primary w-full"} onClick={handleSubmit}>Change Password</button>
            </div>
        </div>
    );
}

export default LoggedInPasswordReset;