const { sequelize } = require("../config/sequelize");

const getOrdersByWorkspaceId = (req, res) => {

}

const getOrdersByUserId = (req, res) => {

}

const deleteOrder = (req, res) => {
    const { id } = req.params

    sequelize.models.orders.destroy({ where: { id: id }})
    .then((deleteOrder) => {
        if (deleteOrder) { 
            console.log('deleted successfuly')
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err.errors[0].message);
    });
}

const updateOrder = (req, res) => {
    const { id } = req.params
    const body = req.body;

    sequelize.models.orders.update(body, { where: { id: id }})
    .then((updatedOrder) => {
        if (updatedOrder) { 
            console.log('updated successfily')
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err.errors[0].message);
    });
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
        res.status(200).send({id: addedNewOrder.dataValues.id});
    })
    .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err.errors[0].message);
    });
}

module.exports = { getOrdersByWorkspaceId, getOrdersByUserId, createNewOrder, updateOrder, deleteOrder }