import React, {useState, useCallback, useContext} from "react";
import axios from "axios";
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import {useNavigate} from "react-router";
import {AppContext} from "../../../store/AppContext";


const EmailPasswordReset = () => {
    const navigate = useNavigate();
    const [, dispatch] = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [mailStatus, setMailStatus] = useState(0);
    const [tokenStatus, setTokenStatus] = useState(0);
    const [password, setPassword] = useState("");
    const [verificationData, setVerificationData] = useState('');
    const [token, setToken] = useState('');

    const handleSendMail = async () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/users/reset-password`, {email})
            .then(({data}) => {
                setVerificationData(data);
                setMailStatus(200);
            })
            .catch((e) => {
                setMailStatus(404);
            });
    };

    const handleReset = async () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/users/validate-token`,
            {id: verificationData.id, token},
            {headers: {token: verificationData.token}})
            .then(() => {
                axios.post(`${process.env.REACT_APP_SERVER_URL}/users/update-password`,
                    {id: verificationData.id, password},
                    {headers: {token: verificationData.token}})
                    .then(() => {
                        navigate('/login');
                    });
            })
            .catch((e) => {
                setTokenStatus(404);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="email"
                    name="email"
                    autoComplete="enail"
                    autoFocus
                    helperText={mailStatus === 404 ? 'It seems like we cant recognize this email, try again' : ''}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{mt: 3, mb: 2}}
                    onClick={handleSendMail}
                >
                    send email
                </Button>
                {mailStatus === 200 ? (
                    <div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="token"
                            label="token"
                            name="token"
                            helperText={tokenStatus === 404 ? 'Incorrect token' : ''}
                            autoFocus
                            onChange={(event) => setToken(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleReset}
                        >
                            reset password
                        </Button>
                    </div>
                ) : null}
            </Box>
        </Container>
    );
};

export default EmailPasswordReset;