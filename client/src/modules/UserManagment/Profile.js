
import React, { useState, useCallback, useContext, useEffect } from "react"
import { AppContext } from "../../store/AppContext";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import axios from 'axios'
import {Button} from "@mui/material";
import ProfileForm from "./ProfileForm";

// import profileLogo from'../../../public/images/emptyProfileIcon.jpeg';

const Profile = () => {
    // name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id
    const [{ user }] = useContext(AppContext);
    const [date, setDate] = useState(new Date)
    const [workspaces, setWorkspaces] = useState([])

    const getWorkspaceAvailabilities = async () => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/availabilities/${user.id}?date=${date}`, {
        })
        .then((res) => {
            console.log("success")
            setWorkspaces(res.data)
        })
        .catch(err =>{
            alert(err.response.data)
            setWorkspaces({})
        })
    }

    const getHostWorkspaces = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/workspaces/hosts/${user.id}`, {});
    }

    useEffect(async () => {
        await getHostWorkspaces()
        // getWorkspaceAvailabilities()
    }, [])



    return (
        <div className={'flex h-full'}>
            <div className={'flex justify-center w-1/3 w-screen mt-7'}>
                <ProfileForm />
            </div>
            <div className={'flex-1'}>
                {/* 111 */}
            </div>
        </div>
    )
}

export default Profile;