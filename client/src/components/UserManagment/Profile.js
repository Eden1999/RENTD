
import React, { useState, useCallback, useContext } from "react"

import PropTypes from 'prop-types';
import axios from 'axios'

const Profile = ({token}) => {


    const getUserData = useCallback(async () => {
        //   const query = {name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id}
  
        const tokenId = token
        axios.get(`http://localhost:8000/users/${tokenId}`, {
            headers: {
                token
            }
        })
        .then((res) => {
            console.log("success")
        })
        .catch(err =>{
            alert(err.response.data)
        })
    })

    const [user, setUser] = useState(getUserData)

    return (
        <div>
            <a>hey</a>
        </div>
    )
}

Profile.propTypes = {
    token: PropTypes.func.isRequired
};

export default Profile;