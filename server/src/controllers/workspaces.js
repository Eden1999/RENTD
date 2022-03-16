const {sequelize} = require('../config/sequelize');

const getWorkspacesList = (req, res) => {

}

// Should validate the user is host
const getWorkspacesByUserId = (req, res) => {

}

const createNewWorkspace = (req, res) => {
    const {name, host_id, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id} = req.body
    
    let newWorkspace = {
        name, 
        host_id,
        location_x, 
        location_y, 
        cost_per_hour, 
        capacity, 
        wifi, 
        disabled_access, 
        smoke_friendly, 
        description,
        space_type_id
    }

    sequelize.models.workspaces.create(newWorkspace)
    .then(() => {
        return res.status(200).send()
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err.message || err.errors[0].message)
    })
}

const editWorkspace = (req, res) => {

}

const searchWorkspaces = (req, res) => {

}

module.exports = { getWorkspacesList, getWorkspacesByUserId, createNewWorkspace, editWorkspace, searchWorkspaces }