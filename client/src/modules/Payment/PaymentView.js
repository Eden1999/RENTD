import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import useToken from "../../helpers/useToken";
import { formatCardNumber } from 'creditcardutils'

function PaymentView() {
    const { token } = useToken();
    const [workspace, setWorkspace] = useState(useLocation().state.workspace);
    const [rentingDetails, setRentingDetails] = useState(useLocation().state.rentingDetails);
    const [costPerHour, setCostPerHour] = useState(useLocation().state.costPerHour);
    const [fullName, setFullName] = useState('');
    const [useSavedCardInfo, setUseSavedCardInfo] = useState(false);
    const [savedCardInfoAvailable, setCardInfoAvailable] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [savedCardInfo, setSavedCardInfo] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        getSavedCardInfo();
    }, []);

    useEffect(() => {
        if (useSavedCardInfo) {
            setCardNumber(savedCardInfo.cardNumber);
            setExpirationMonth(savedCardInfo.expirationMonth);
            setExpirationYear(savedCardInfo.expirationYear);
        }
        else {
            setCardNumber("");
            setSecurityCode("");
            setExpirationMonth("");
            setExpirationYear("");
        }
    }, [useSavedCardInfo]);

    const getSavedCardInfo = () => {
        axios.get('http://localhost:8000/users/getCardInfo',
            {
                headers: { token: token }
            })
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    setSavedCardInfo({ cardNumber: res.data.card_number, expirationMonth: res.data.expiration_month, expirationYear: res.data.expiration_year });
                    setCardInfoAvailable(true);
                }
            })
    };

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
        const numOfRentingHours = Math.abs(new Date(rentingDetails.startdate) - new Date(rentingDetails.enddate)) / (1000 * 3600);
        return (costPerHour * numOfRentingHours * rentingDetails.capacity);
    }

    return (
        <div>
            <form autoComplete="off" className="flex flex-row flex-1 mx-20 my-10 2xl:my-20">
                <div className="w-1/2 self-center">
                    <span className="text-primary text-5xl font-medium">Your Details</span>
                    <div className="flex my-6 justify-between">
                        <div className="w-1/2 mb-6">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Full Name:
                            </label>
                            <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                                placeholder={'First Last'}
                                value={fullName}
                                onChange={(e) => { setFullName(e.target.value) }}
                            />
                        </div>
                        <div className="w-1/2 ml-6 mb-6">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Phone Number:
                            </label>
                            <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                                placeholder={'e.g. 052-1234567'}
                                onChange={(e) => { setPhoneNumber(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="w-1/2 mb-6">
                        <label className="block mb-2 text-lg font-medium text-primary">
                            Email Address:
                        </label>
                        <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                            placeholder={'email@address.com'}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>
                    <span className="text-primary text-2xl">Billing Details</span>
                    {/* Payment div */}
                    <div className="flex mt-2 select-none">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="peer form-radio"
                                name="accountType"
                                value="saved"
                                disabled={!savedCardInfoAvailable}
                                checked={useSavedCardInfo}
                                onChange={() => { setUseSavedCardInfo(true) }} />
                            <span className="ml-2 font-medium text-gray-600 peer-checked:text-primary peer-disabled:text-secondary peer-disabled:font-normal peer-disabled:line-through">Use saved info</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                            <input
                                type="radio"
                                className="peer form-radio"
                                name="accountType"
                                value="new"
                                checked={(!savedCardInfoAvailable) || !useSavedCardInfo}
                                onChange={() => setUseSavedCardInfo(false)} />
                            <span className="ml-2 font-medium text-gray-600 peer-checked:text-primary">Use new credit card</span>
                        </label>

                    </div>
                    <div className="flex mt-4 mb-6 justify-between">

                    </div>
                    <div className="flex mt-4 mb-6 justify-between">

                        <div className="w-1/2">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Card Number:
                            </label>
                            <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                                placeholder={'XXXX XXXX XXXX XXXX'}
                                value={useSavedCardInfo ? cardNumber : formatCardNumber(cardNumber)}
                                readOnly={useSavedCardInfo}
                                onChange={(e) => { console.log("triggered"); setCardNumber(e.target.value) }}
                            />
                        </div>
                        <div className="w-1/2 ml-6">
                            <label className="block mb-2 text-lg font-medium text-primary">
                                Expiration:
                            </label>
                            <div className="flex">
                                <div className="w-1/2">
                                    <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                                        value={expirationMonth}
                                        readOnly={useSavedCardInfo}
                                        onChange={(e) => { setExpirationMonth(e.target.value) }}
                                        placeholder={'MM'}
                                    />
                                </div>
                                <div className="w-1/2 ml-6">
                                    <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                                        value={expirationYear}
                                        readOnly={useSavedCardInfo}
                                        onChange={(e) => { setExpirationYear(e.target.value) }}
                                        placeholder={'YY'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mb-6">
                        <label className="block mb-2 text-lg font-medium text-primary">
                            Security Code:
                        </label>
                        <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                            placeholder={'XXX'}
                            value={securityCode}
                            onChange={(e) => { setSecurityCode(e.target.value) }}
                        />
                    </div>
                    <div className="flex mb-6 justify-end">
                        <button type="button" className={"btn btn-lg btn-primary"} onClick={onSubmit}>Book Now</button>
                    </div>
                </div>
                <div className="flex-1 flex-col flex ml-36">
                    <div className={`flex flex-col flex-1 rounded-lg p-3 m-5`}>
                        <img className={"rounded-md mb-5"} src={workspace.photos?.[0]} alt={workspace.name} />
                        <span className={"flex flex-col text-left flex-1"}>
                            <span className={"font-semibold text-2xl text-primary mt-1.5"}>{workspace.name}, {workspace.city}, {workspace.address}</span>
                            <span className={"text-secondary mt-1.5"}>{new Date(rentingDetails.startdate).toLocaleString()} - {new Date(rentingDetails.enddate).toLocaleString()}</span>
                            <span className={"text-secondary mt-1.5"}>{rentingDetails.capacity} guests</span>
                            <div className={"divider"} />
                            <span className={"font-semibold text-2xl text-primary"}>Total: {getTotalPrice()}₪ </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaymentView;
