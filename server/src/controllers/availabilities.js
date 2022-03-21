const {sequelize} = require('../config/sequelize');

// TODO: add by date
const getAllAvailabilitiesForWorkspace = (req, res) => {
    const {workspaceId, date} = req.params

    sequelize.models.availabilities.findAll({ where: {
        workspace_id: workspaceId,
        startDate: {
            $gte: date
        },
        endDate: {
            lte: date
        }
    }})
    .then((availabilities) => {
        if (availabilities) {
            availabilities.map(availability => availability.dataValues)
            return res.status(200).send(availabilities)
        } else {
            let err = 'availabilities not found'
            console.log(err)
            return res.status(500).send(err)
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err)
    })
}

const getAllRentedAvailabilitiesbyUserId = () => {
    const {id} = req.params

    sequelize.models.availabilities.findAll({ where: {user_id: id} })
    .then((availabilities) => {
        if (availabilities) {
            availabilities.map(availability => availability.dataValues)
            return res.status(200).send(availabilities)
        } else {
            let err = 'availabilities not found'
            console.log(err)
            return res.status(500).send(err)
        }
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err)
    })
}

const addNewAvailability = (req, res) => {

}

module.exports = { getAllAvailabilitiesForWorkspace, getAllRentedAvailabilitiesbyUserId }