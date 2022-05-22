import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Container, CssBaseline, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { AppContext } from "../../store/AppContext";
import Checkbox from "@mui/material/Checkbox";
import useToken from "../../helpers/useToken";
import { useForm } from "react-hook-form";
import { validate as validate_email } from "email-validator";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [, dispatch] = useContext(AppContext);
  const [isHost, setIsHost] = useState(false);
  const [photo, setPhoto] = useState("");
  const { token, setToken } = useToken();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });

  const handleRegister = ({ username, password, email }) => {
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
        toast.success("Registration successfull!");

        navigate(res.data.user.is_host ? "/my-spaces" : "/homepage");
      })
      .catch((err) => {
        toast.error(err.response.data);
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit(handleRegister)}>
          <span className={"font-semibold text-3xl text-zinc-300"}>
            Register
          </span>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-zinc-400">
              Email Address:
            </label>
            <input
              type="text"
              {...register("email", { required: true, minLength: 4, validate: value => validate_email(value) })}
              className={`input 2xl:select-lg font-normal w-full bg-zinc-700 text-white invalid:ring-red-700 invalid:border-red-700 ${errors.email ? "invalid-input" : "valid-input"}`}
              placeholder={'email@address.com'}

            />
            {errors.email && <div className="text-red-700">Invalid email address</div>}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-zinc-400">
              User name:
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              className={`input 2xl:select-lg font-normal w-full bg-zinc-700 text-white invalid:ring-red-700 invalid:border-red-700 ${errors.username ? "invalid-input" : "valid-input"}`}
              placeholder={'user'}
            />
            {errors.username && <div className="text-red-700">Invalid username</div>}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-zinc-400">
              Password:
            </label>
            <input
              {...register("password", { required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$&*_^()+])(?=.*[0-9]).{8,20}$/ })}
              type="password"
              className={`input 2xl:select-lg font-normal w-full bg-zinc-700 text-white invalid:ring-red-700 invalid:border-red-700 ${errors.password ? "invalid-input" : "valid-input"}`}
              placeholder={'******'}
            />
            {errors.password && <div className="text-red-700">Password must be between 8 and 20 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character</div>}
          </div>
          <div class="flex items-center">
            <span className={"font-semibold text-zinc-300"}>Are you a host?</span>
            <Checkbox
              checked={isHost}
              onChange={handleIsHostChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
          <input
            className={"text-zinc-300"}
            type="file"
            label="Photo"
            name="photo"
            accept=".jpeg, .png, .jpg"
            onChange={handlePhotoUpload}
          />
          <div className="photo-preview">
            <img src={photo} />
          </div>
          <div className="flex mb-6 justify-end">
            <button type="submit" className={"btn btn-lg btn-primary"}>Register</button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

Register.propTypes = {
  // setToken: PropTypes.func.isRequired,
  // setRegisterMode: PropTypes.func.isRequired,
};

export default Register;
