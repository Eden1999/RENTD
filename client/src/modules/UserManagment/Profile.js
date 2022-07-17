import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../../store/AppContext";
import axios from 'axios'
import ProfileForm from "./ProfileForm";

const Profile = () => {
    const [{ user }] = useContext(AppContext);
    const [date, setDate] = useState(new Date)
    const [workspaces, setWorkspaces] = useState([])

    const getWorkspaceAvailabilities = async () => {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}availabilities/${user.id}?date=${date}`, {
        })
        .then((res) => {
            setWorkspaces(res.data)
        })
        .catch(err =>{
            alert(err.response.data)
            setWorkspaces({})
        })
    }

    const getHostWorkspaces = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}workspaces/hosts/${user.id}`, {});
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