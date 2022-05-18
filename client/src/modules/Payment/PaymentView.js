import React, { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {ToastContainer, toast } from "react-toastify";

function PaymentView() {
    const [workspace, setWorkspace] = useState(useLocation().state.workspace);
    const [rentingDetails, setRentingDetails] = useState(useLocation().state.rentingDetails);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        axios.post('http://localhost:8000/orders/create', rentingDetails)
            .then((res) => {
                toast.success('Your order has been confirmed!', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    onClose: () => navigate('/homepage')
                });
            })
            .catch(err => {
                toast.error('Error! something went wrong with the order', {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                });
                console.log(err.response.data);
            })
    }

    const getTotalPrice = () => {
        const numOfRentingHours = Math.abs(rentingDetails.startdate - rentingDetails.enddate)/(1000*3600);
        console.log(numOfRentingHours);
        return(rentingDetails.cost_per_hour * numOfRentingHours);
    }

    return (
        <div>
            <form autoComplete="off" className="flex flex-row flex-1 mx-20 my-10 2xl:my-20">
                <div className="w-1/2 self-center">
                    <span className="text-white text-2xl">Your Details</span>
                    <div className="flex mb-6 justify-between">
                        <div className="w-1/2 mb-6">
                            <label className="label block mb-2 text-sm font-medium text-zinc-400">
                                Full Name:
                            </label>
                            <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                                   placeholder={'First Last'}
                                   value={fullName}
                            />
                        </div>
                        <div className="w-1/2 ml-6 mb-6">
                            <label className="label block mb-2 text-sm font-medium text-zinc-400">
                                Phone Number:
                            </label>
                            <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                                   placeholder={'e.g. 052-1234567'}
                                   value={phoneNumber}
                            />
                        </div>
                    </div>
                    <div className="w-1/2 mb-6">
                        <label className="label block mb-2 text-sm font-medium text-zinc-400">
                            Email Address:
                        </label>
                        <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                               placeholder={'email@address.com'}
                               value={email}
                        />
                    </div>
                    <span className="text-white text-2xl">Billing Details</span>
                    <div className="flex mb-6 justify-between">
                        <div className="w-1/2">
                            <label className="label block mb-2 text-sm font-medium text-zinc-400">
                                Card Number:
                            </label>
                            <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                                   placeholder={'XXXX XXXX XXXX XXXX'}
                                   value={cardNumber}
                            />
                        </div>
                        <div className="w-1/2 ml-6">
                            <label className="flex flex-row label block mb-2 text-sm font-medium text-zinc-400">
                                Expiration:
                            </label>
                            <div className="flex">
                               <div className="w-1/2">
                                   <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                                          value={expirationMonth}
                                          placeholder={'MM'}
                                   />
                               </div>
                                <div className="w-1/2 ml-6">
                                    <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                                           value={expirationYear}
                                           placeholder={'YYYY'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mb-6">
                        <label className="label block mb-2 text-sm font-medium text-zinc-400">
                            Security Code:
                        </label>
                        <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                               placeholder={'XXX'}
                               value={securityCode}
                        />
                    </div>
                    <div className="flex mb-6 justify-end">
                        <button type="button" className={"btn btn-lg btn-secondary"} onClick={onSubmit}>Book Now</button>
                    </div>
                </div>
                <div className="flex-1 flex-col flex ml-36">
                    <div className={`flex flex-col flex-1 bg-zinc-700 rounded-lg p-3 m-5`}>
                        <img className={"rounded-md mb-5"} src={workspace.photo} alt={workspace.name} />
                        <span className={"flex flex-col text-left flex-1"}>
                            <span className={"font-semibold text-2xl text-zinc-300 mt-1.5"}>{workspace.name}, {workspace.city}, {workspace.address}</span>
                            <span className={"text-zinc-300 mt-1.5"}>{rentingDetails.startdate.toLocaleString()} - {rentingDetails.enddate.toLocaleString()}</span>
                            <span className={"text-zinc-300 mt-1.5"}>{rentingDetails.capacity} guests</span>
                            <div className={"divider"} />
                            <span className={"font-semibold text-2xl text-zinc-300"}>Total: {getTotalPrice()}₪ </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaymentView;
