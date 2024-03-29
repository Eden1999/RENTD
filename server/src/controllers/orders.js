const { sequelize } = require("../config/sequelize");
const { getWorkspaceWithoutPhotos } = require("./workspaces");

const getOrdersByWorkspaceId = (req, res) => {
  const { workspaceId, date } = req.params;

  sequelize.models.orders
    .findAll({
      where: {
        workspace_id: workspaceId,
        // startDate: {
        //     $gte: date
        // },
        // endDate: {
        //     lte: date
        // }
      },
    })
    .then((orders) => {
      if (orders) {
        orders.map((order) => {
          let newOrder = order.dataValues;

          newOrder.startDate = order.startdate;
          delete newOrder.startdate;

          newOrder.endDate = order.enddate;
          delete newOrder.enddate;
        });
        return res.status(200).send(orders);
      } else {
        let err = "orders not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err.message);
    });
};

const getOrdersByUserId = (req, res) => {
  const { userId } = req.params;

  sequelize.models.orders
    .findAll({
      include: [
        {
          model: sequelize.models.workspaces,
          required: true,
        },
      ],
      where: { user_id: userId },
    })
    .then(async (orders) => {
      if (orders) {
        
        orders.map((order) => order.dataValues);

        orders = await Promise.all(
          orders.map(async ({ dataValues: order }) => {
            const workspace = (await getWorkspaceWithoutPhotos(order.workspace_id))[0];
            const ratings = await sequelize.models.ratings.findAll({
              where: { workspace_id: workspace.id },
              include: {
                model: sequelize.models.users,
              },
            });
            const host = await sequelize.models.users.findOne({
              where: { id: workspace.host_id },
            });
            const spaceType = await sequelize.models.space_types.findOne({
              where: { id: workspace.space_type_id },
            });
            const assets = await sequelize.models.assets.findAll({
              where: { workspace_id: workspace.id },
            });

            return {
              ...order,
              workspace: { ...workspace, ratings, host, spaceType, assets },
            };
          })
        );

        return res.status(200).send(orders);
      } else {
        let err = "orders not found";
        console.log(err);
        return res.status(500).send(err.message);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err.message);
    });
};

const deleteOrder = (req, res) => {
  const { id } = req.params;

  sequelize.models.orders
    .destroy({ where: { id: id } })
    .then((deleteOrder) => {
      if (deleteOrder) {
        console.log("deleted successfuly");
        return res.status(200).send("deleted successfuly");
      }
      return res.status(400).send("order not found");
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err.message);
    });
};

const updateOrder = (req, res) => {
  const { id } = req.params;
  const body = req.body;

  sequelize.models.orders
    .update(body, { where: { id: id } })
    .then((updatedOrder) => {
      if (updatedOrder) {
        console.log("updated successfily");
      }
      return res.status(200).send("OK");
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err.message);
    });
};

const createNewOrder = (req, res) => {
  const { startdate, enddate, capacity, user_id, workspace_id, asset_id } = req.body;

  let newOrder = {
    startdate,
    enddate,
    capacity,
    user_id,
    workspace_id,
    available: false,
    asset_id,
  };

  sequelize.models.orders
    .create(newOrder)
    .then((addedNewOrder) => {
      console.log(`successfully ordered`);
      res.status(200).send({ id: addedNewOrder.dataValues.id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err.errors ? err.errors[0].message : err);
    });
};

module.exports = {
  getOrdersByWorkspaceId,
  getOrdersByUserId,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
