import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Container, CssBaseline, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { AppContext } from "../../store/AppContext";
import Checkbox from "@mui/material/Checkbox";
import useToken from "../../helpers/useToken";

const Register = () => {
  const navigate = useNavigate();
  const [, dispatch] = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [photo, setPhoto] = useState("");
  const { token, setToken } = useToken();

  const handleRegister = () => {
    const query = { username, password, email, isHost, photo };

    axios
      .post("http://localhost:8000/users/register", query)
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
        alert(err.response.data);
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
                     placeholder={'email@address.com'}
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
                  <span className="label-text font-medium text-primary">register as a host</span>
                  <input type="checkbox"
                         checked={isHost}
                         onChange={handleIsHostChange}
                         className="checkbox checkbox-primary"
                  />
              </label>
          </div>
          <div className="mb-6">
              <img class="mask mask-circle w-36 h-36 mb-2" src={photo} />
              <input
                  className="block mb-2 font-medium text-primary"
                  type="file"
                  label="Photo"
                  name="photo"
                  accept=".jpeg, .png, .jpg"
                  onChange={handlePhotoUpload}
                />
          </div>
          <div className="flex mb-6 justify-end">
              <button type="button" className={"btn btn-lg btn-primary"} onClick={handleRegister}>Register</button>
          </div>
    </div>
  );
};

Register.propTypes = {
  // setToken: PropTypes.func.isRequired,
  // setRegisterMode: PropTypes.func.isRequired,
};

export default Register;
