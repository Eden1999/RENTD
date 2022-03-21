
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

// import profileLogo from'../../../public/images/emptyProfileIcon.jpeg';

const Profile = () => {
    // name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id
    const [{ user }] = useContext(AppContext);
    const [workspaces, setWorkspaces] = useState([])
    const [date, setDate] = useState(new Date)

    const getWorkspaceAvailabilities = async () => {
        await axios.get(`http://localhost:8000/availabilities/${user.id}?date=${date}`, {
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
        // getWorkspaceAvailabilities()
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
            {user.is_host && 
            <div className="host-places">
                <a>My Workspaces</a>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {workspaces && workspaces.map(workspace => 
                        <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={workspace.name} src={workspace.icon || "/emptyProfileIcon.jpeg"} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={workspace.name}
                            secondary={
                                <React.Fragment>
                                    {workspace.description}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    )}
                </List>
            </div>
            }
            {!user.is_host && 
            <div className="host-places">
                <a>My Rented Workspaces</a>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {workspaces && workspaces.map(workspace => 
                        <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={workspace.name} src={workspace.icon || "/emptyProfileIcon.jpeg"} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={workspace.name}
                            secondary={
                                <React.Fragment>
                                    {workspace.description}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    )}
                </List>
            </div>
            }
        </div>
    )
}

export default Profile;