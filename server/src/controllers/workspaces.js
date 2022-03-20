const {sequelize} = require('../config/sequelize');
const jwt = require("jsonwebtoken");

const getWorkspacesList = (req, res) => {

}

const getWorkspacesByHostId = (req, res) => {
    const {hostId} = req.params

    sequelize.models.workspaces.findAll({ where: {host_id: hostId} })
    .then((workspaces) => {
        if (workspaces) {
            workspaces.map(workspace => workspace.dataValues)
            return res.status(200).send(workspaces)
        } else {
            let err = 'workspaces not found'
            console.log(err)
            return res.status(500).send(err)
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err)
    })
}

// Should validate the user is host
const getWorkspacesByUserId = (req, res) => {

}

const createNewWorkspace = (req, res) => {
    const {token} = req.headers
    const {name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id} = req.body
    
    const decodeId = jwt.verify(token, process.env.SECRET_KEY);

    let newWorkspace = {
        name, 
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

    // check if user is already exist
    sequelize.models.users.findOne({ where: {id: decodeId} })
    .then((user) => {
        if (user) {
            newWorkspace.host_id = user.id
            sequelize.models.workspaces.create(newWorkspace)
            .then(() => {
                return res.status(200).send()
            })
            .catch((err) => {
                console.log(err)
                return res.status(err.status || 500).send(err.message || err.errors[0].message)
            })
        } else {
            let err = 'user not found'
            console.log(err)
            return res.status(500).send(err)
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err)
    });
    
}

const editWorkspace = (req, res) => {

}

const searchWorkspaces = (req, res) => {

}

module.exports = { getWorkspacesList, getWorkspacesByUserId, createNewWorkspace, editWorkspace, searchWorkspaces, getWorkspacesByHostId }