const { sequelize } = require("../config/sequelize");

const getOrdersByWorkspaceId = async (req, res) => {
    const {workspaceId} = req.params
    const {currentDate} = req.query

    let date = new Date(currentDate)
    let first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstday = new Date(date.setDate(first)).toUTCString
    let lastday = new Date(date.setDate(last)).toUTCString

    let resOrders = []

    await sequelize.models.orders.findAll({ where: {
        workspace_id: workspaceId,
        // startdate: {
        //     $between: [firstday, lastday]
        //   }
        // startdate: {
        //     $gte: new Date()
        // },
        // enddate: {
        //     $lte: lastday
        // }
    }})
    .then((orders) => {
        if (orders) {
            orders.map(order => {
                let newOrder = order.dataValues
                
                newOrder.startDate = order.startdate
                delete newOrder.startdate

                newOrder.endDate = order.enddate
                delete newOrder.enddate

                await axios.get(`http://localhost:8000/users/${order.user_id}`)
                .then((res) => {
                    console.log("success")
                })
                .catch(err =>{
                    alert(err.response.data)
                })
                // await sequelize.models.users
                // .findOne({ where: { id: order.user_id } })
                // .then((user) => {
                //     if (user) {
                //         newOrder.userName = user.dataValues.username
                //         resOrders.push(newOrder)
                //     }
                // })
                // .catch((err) => {
                //     let errUser = 'user not found'
                //     console.log(errUser)
                //     return res.status(500).send(errUser)
                // })
            })
        } else {
            let err = 'orders not found'
            console.log(err)
            return res.status(500).send(err)
        }

        if (resOrders) {
            resOrders.map((order) => {
                
            })
        }
        return res.status(200).send(resOrders)
    })
    .catch((err) => {
        console.log(err)
        return res.status(err.status || 500).send(err)
    })
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