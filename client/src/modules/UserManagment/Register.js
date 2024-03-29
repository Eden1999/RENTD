import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AppContext } from "../../store/AppContext";
import useToken from "../../helpers/useToken";
import { formatCardNumber } from 'creditcardutils'
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [, dispatch] = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [saveCardInfo, setSaveCardInfo] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [photo, setPhoto] = useState("");
  const { token, setToken } = useToken();

  const handleRegister = () => {
    const query = { username, password, email, isHost, photo, cardNumber, expirationMonth, expirationYear, saveCardInfo };

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}users/register`, query)
      .then((res) => {
        if (res.data.token) {
          setToken(res.data.token);
        }

        dispatch({
          type: "SET_GENERAL_STATE",
          payload: {
            user: res.data.user,
          },
        });

        sessionStorage.setItem("user", JSON.stringify(res.data.user));

        navigate(res.data.user.is_host ? "/my-spaces" : "/homepage");
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
        });
      });
  };

  const handleIsHostChange = () => [setIsHost(!isHost)];

  const handlePhotoUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      const base64Photo = await convertToBase64(file);
      setPhoto(base64Photo);
    },
    [setPhoto]
  );

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
    <div className="w-1/3 self-center m-8">
      <div className="mb-12">
        <span className="font-semibold text-6xl text-primary">
          Register
        </span>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-primary">
          Email Address:
        </label>
        <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
          placeholder={'email@address.com'}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-primary">
          User Name:
        </label>
        <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
          placeholder={'Username'}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-primary">
          Password:
        </label>
        <input type="password"
          className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
          placeholder={'******'}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="label cursor-pointer">
          <span className="label-text text-lg font-medium text-primary">I'm a host</span>
          <input type="checkbox"
            checked={isHost}
            onChange={handleIsHostChange}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="label cursor-pointer">
          <span className="label-text text-lg font-medium text-primary">Save credit card info</span>
          <input type="checkbox"
            checked={saveCardInfo}
            onChange={(e) => { setSaveCardInfo(!saveCardInfo) }}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
      {saveCardInfo && <div className="flex mt-2 select-none">
        <div className="flex mt-4 mb-6 justify-between">
          <div className="w-1/2">
            <label className="block mb-2 text-lg font-medium text-primary">
              Card Number:
            </label>
            <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
              placeholder={'XXXX XXXX XXXX XXXX'}
              value={formatCardNumber(cardNumber)}
              onChange={(e) => { setCardNumber(e.target.value) }}
            />
          </div>
          <div className="w-1/2 ml-6">
            <label className="block mb-2 text-lg font-medium text-primary">
              Expiration:
            </label>
            <div className="flex">
              <div className="w-1/2">
                <input
                  minLength={2}
                  maxLength={2}
                  className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                  value={expirationMonth.replace(/[^\d]/, '')}
                  onChange={(e) => { setExpirationMonth(e.target.value) }}
                  placeholder={'MM'}
                />
              </div>
              <div className="w-1/2 ml-6">
                <input
                  minLength={2}
                  maxLength={2}
                  className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                  value={expirationYear.replace(/[^\d]/, '')}
                  onChange={(e) => { setExpirationYear(e.target.value) }}
                  placeholder={'YY'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      }
      <div className="mb-6">
        <img className="mask mask-circle w-36 h-36 mb-2" src={photo} />
        <input
          className="block mb-2 font-medium text-primary"
          type="file"
          label="Photo"
          name="photo"
          accept=".jpeg, .png, .jpg"
          onChange={handlePhotoUpload}
        />
      </div>
        <div className="flex mb-6 justify-center">
            <button
                type="button"
                className={"btn btn-lg btn-secondary text-white"}
                onClick={() => navigate("/login")}>
                Back to login
            </button>
            <button type="button" className={"btn btn-lg btn-primary ml-8"} onClick={handleRegister}>Register</button>
        </div>
    </div>
  );
};

Register.propTypes = {
  // setToken: PropTypes.func.isRequired,
  // setRegisterMode: PropTypes.func.isRequired,
};

export default Register;
