import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../store/AppContext";
import { defaultRoutes, userTypes } from "../consts";
import useToken from '../useToken';

const classifyUser = (token, user) => {
    if(token && Object.keys(user).length) {
        return user?.is_host ? userTypes.host : userTypes.guest
    } else {
        return userTypes.notSigned;
    }
}

const ProtectedRoute = (props) => {
    const { token } = useToken();
    const [{ user }] = useContext(AppContext);
    const {allowedUserType } = props;


    return classifyUser(token, user) === allowedUserType ? 
            <Outlet /> : 
            <Navigate to={defaultRoutes[classifyUser(token, user)]}/>;
}

ProtectedRoute.propTypes = {}

export default ProtectedRoute
