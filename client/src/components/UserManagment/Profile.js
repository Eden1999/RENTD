
import React, { useState, useCallback, useContext, useEffect } from "react"
import { AppContext } from "../../store/AppContext";
import PropTypes from 'prop-types';
import axios from 'axios'

// import profileLogo from'../../../public/images/emptyProfileIcon.jpeg';

const Profile = () => {
    // name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id
    const [{ user }] = useContext(AppContext);
    const [workspaces, setWorkspaces] = useState([])

    // const getUserData = async () => {
    //     const tokenId = token
    //     await axios.get(`http://localhost:8000/users/${tokenId}`, {
    //         headers: {
    //             token
    //         }
    //     })
    //     .then((res) => {
    //         console.log("success")
    //         setUser(res.data)
    //     })
    //     .catch(err =>{
    //         alert(err.response.data)
    //         setUser({})
    //     })
    // }

    // useEffect(() => {
    //     getUserData()
    // }, [])

    const getHostWorkspaces = async () => {
            await axios.get(`http://localhost:8000/workspaces/hosts/${user.id}`, {
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

    useEffect(() => {
        getHostWorkspaces()
    }, [])

    return (
        <div>
            <div className="profile-data">
            Profile
            <img src={user.profileIcon || "emptyProfileIcon.jpeg"}/>
            <a>name: {user.username}</a>
            <br/>
            <a>email: {user.email}</a>
            <br/>
            <a>password: {user.password}</a>
            </div>
            <div className="host-places">
                <a></a>
            </div>
        </div>
    )
}

export default Profile;