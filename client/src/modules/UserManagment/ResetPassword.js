import React, {useContext} from "react";
import {AppContext} from "../../store/AppContext";
import LoggedInPasswordReset from "./ResetPassword/LoggedInPasswordReset";
import EmailPasswordReset from "./ResetPassword/EmailPasswordReset";
import _ from "lodash";

const ResetPassword = () => {
    const [{user}] = useContext(AppContext);
    if (!_.isEmpty(user)) {
        return (<LoggedInPasswordReset/>);
    }
    else {
        return (<EmailPasswordReset/>);
    }
};

ResetPassword.propTypes = {
    // setToken: PropTypes.func.isRequired,
    // setRegisterMode: PropTypes.func.isRequired,
};

export default ResetPassword;
