import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../store/AppContext";
import { defaultRoutes, userTypes } from "../consts";

const classifyUser = (user) => {
    if(Object.keys(user).length) {
        return user?.is_host ? userTypes.host : userTypes.guest
    } else {
        return userTypes.notSigned;
    }
}

const ProtectedRoute = (props) => {
    const [{ user }] = useContext(AppContext);
    const {allowedUserType } = props;


    return allowedUserType.includes(classifyUser(user)) ? 
            <Outlet /> : 
            <Navigate to={defaultRoutes[classifyUser(user)]}/>;
}

ProtectedRoute.propTypes = {}

export default ProtectedRoute
