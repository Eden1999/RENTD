const { sequelize } = require("../config/sequelize");

const getOrdersByWorkspaceId = (req, res) => {

}

const getOrdersByUserId = (req, res) => {

}

const createNewOrder = (req, res) => {
    const { startdate, enddate, capacity, user_id, workspace_id } = req.body;

    let newOrder = {
        startdate,
        enddate,
        capacity,
        user_id,
        workspace_id,
        available: false
    }

    sequelize.models.orders
    .create(newOrder)
    .then((addedNewOrder) => {
        console.log(`successfully ordered`)
        res.status(200).send();
    })
    .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err.errors[0].message);
    });
}

module.exports = { getOrdersByWorkspaceId, getOrdersByUserId, createNewOrder }