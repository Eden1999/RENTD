const { sequelize } = require("../config/sequelize");
const { Op } = require("@sequelize/core");
const jwt = require("jsonwebtoken");
const { mostFrequent } = require("../helpers");

const getWorkspacesList = (req, res) => {
  sequelize.models.workspaces
    .findAll()
    .then((workspaces) => {
      if (workspaces) {
        workspaces.map((workspace) => workspace.dataValues);
        return res.status(200).send(workspaces);
      } else {
        let err = "workspaces not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const getWorkspacesByHostId = async (req, res) => {
  const { hostId } = req.params;

  sequelize.models.workspaces
    .findAll({ where: { host_id: hostId } })
    .then(async (workspaces) => {
      if (workspaces) {
        const fullWorkspaces = await Promise.all(
          workspaces.map(async ({ dataValues: workspace }) => {
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
            return { ...workspace, ratings, host, spaceType, assets };
          })
        );
        return res.status(200).send(fullWorkspaces);
      } else {
        let err = "workspaces not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const getUserFavoriteWorkspaces = (req, res) => {
  const { token } = req.headers;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  // check if user exists
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then(async (user) => {
      if (user) {
        sequelize.models.workspaces
          .findAll({ where: { id: { [Op.in]: user?.dataValues?.favorite_workspaces || [] } } })
          .then(async (workspaces) => {
            if (workspaces) {
              const fullWorkspaces = await Promise.all(
                workspaces.map(async ({ dataValues: workspace }) => {
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
                  return { ...workspace, ratings, host, spaceType, assets };
                })
              );
              return res.status(200).send(fullWorkspaces);
            } else {
              let err = "workspaces not found";
              console.log(err);
              return res.status(500).send(err);
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err);
          });
      } else {
        let err = "user not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

// Should validate the user is host
const getWorkspacesByUserId = (req, res) => {};

const createNewWorkspace = (req, res) => {
  const { token } = req.headers;
  const { workspace } = req.body;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  let assets = workspace.assets;
  delete workspace.assets;

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        workspace.host_id = user.id;
        sequelize.models.workspaces
          .create(workspace)
          .then((addedWorkspace) => {
            if (assets.length > 0) {
              assets.map((asset) => {
                asset.workspace_id = addedWorkspace.id;
                sequelize.models.assets
                  .create(asset)
                  .then(() => {
                    console.log("added asset");
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(err.status || 500).send(err.message || err.errors[0].message);
                  });
              });
              return res.status(200).send();
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err.message || err.errors[0].message);
          });
      } else {
        let err = "user not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const editWorkspace = (req, res) => {
  const { workspaceId } = req.params;

  const { token } = req.headers;
  const { workspace } = req.body;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  let assets = workspace.assets;
  delete workspace.assets;

  let assetsArray = assets
    ? assets
        .filter((asset) => asset.id)
        .map((x) => {
          return x.id;
        })
    : [];

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        sequelize.models.workspaces
          .update(workspace, { where: { id: workspaceId } })
          .then(() => {
            // delete
            sequelize.models.assets
              .destroy({ where: { workspace_id: workspaceId, id: { [Op.notIn]: assetsArray } } })
              .then(() => {
                console.log("asset deleted");
              })
              .catch((err) => {
                console.log(err);
                return res.status(err.status || 500).send(err.message || err.errors[0].message);
              });

            assets.map((asset) => {
              if (asset.id) {
                sequelize.models.assets
                  .update(asset, { where: { id: asset.id } })
                  .then(() => {
                    console.log("asset updated");
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(err.status || 500).send(err.message || err.errors[0].message);
                  });
              } else {
                asset.workspace_id = workspace.id;
                sequelize.models.assets
                  .create(asset)
                  .then(() => {
                    console.log("asset added");
                  })
                  .catch((err) => {
                    console.log(err);
                    return res.status(err.status || 500).send(err.message || err.errors[0].message);
                  });
              }
            });
            return res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err.message || err.errors[0].message);
          });
      } else {
        let err = "user not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const searchWorkspaces = async (req, res) => {
  try {
    const { city, capacity, space_type_id } = req.query;

    let assets = await sequelize.models.assets.findAll({
      where: {
        capacity: {
          [Op.gte]: capacity,
        },
      },
    });

    let workspacesIds = [];

    if (assets.length > 0) {
      workspacesIds = assets.map((asset) => {
        return parseInt(asset.workspace_id);
      });
    }

    let workspaces = await sequelize.models.workspaces.findAll({
      where: {
        city: city,
        space_type_id: space_type_id,
        id: { [Op.in]: workspacesIds },
      },
    });

    workspaces = await Promise.all(
      workspaces.map(async ({ dataValues: workspace }) => {
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
        return { ...workspace, ratings, host, spaceType, assets };
      })
    );
    res.send(workspaces);
  } catch (err) {
    console.log(`Failed to find workspaces: ${err.message}`);
    res.status(400).send(`Failed to find workspaces: ${err.message}`);
  }
};

const deleteWorkspace = async (req, res) => {
  const { id } = req.params;

  const { token } = req.headers;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        sequelize.models.workspaces
          .destroy({ where: { id: id } })
          .then(() => {
            return res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err.message || err.errors[0].message);
          });
      } else {
        let err = "user not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const getUserRecommendations = async (req, res) => {
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
        let priorities = [
          {
            name: "wifi",
            count: 0,
            value: true,
          },
          {
            name: "disabled_access",
            count: 0,
            value: true,
          },
          {
            name: "smoke_friendly",
            count: 0,
            value: true,
          },
        ];

        let cities = [];
        let spaceTypes = [];
        let visitedWorkspaces = [];

        orders.map((order) => {
          cities.push(order.workspace.dataValues.city);
          spaceTypes.push(order.workspace.dataValues.space_type_id);
          order.workspace.dataValues.wifi && priorities[0].count++;
          order.workspace.dataValues.disabled_access && priorities[1].count++;
          order.workspace.dataValues.smoke_friendly && priorities[2].count++;
          visitedWorkspaces.push(order.workspace.dataValues.id);
        });

        let resCity = mostFrequent(cities, cities.length);
        let resSpaceType = mostFrequent(spaceTypes, spaceTypes.length);

        priorities.push({ name: "city", count: resCity.max_count, value: resCity.res });
        priorities.push({
          name: "space_type_id",
          count: resSpaceType.max_count,
          value: resSpaceType.res,
        });

        priorities.sort((a, b) => a.count - b.count);

        let workspaces = await sequelize.models.workspaces.findAll();

        let ranks = [];

        // Rank each workspace according to wether he has the most ordered elements, and by priority
        workspaces.forEach((workspace) => {
          let rank = 0;
          !visitedWorkspaces.includes(workspace.dataValues.id) &&
            priorities.forEach((priority, index) => {
              if (workspace.dataValues[priority.name] == priority.value) {
                rank += index;
              }
            });

          ranks.push({ rank, workspace: workspace });
        });

        ranks.sort((a, b) => b.rank - a.rank);
        ranks = ranks.map((rank) => rank.workspace);

        workspaces = await workspaceStructure(ranks.slice(0, 3));

        return res.status(200).send(workspaces);
      } else {
        let workspaces = await sequelize.models.workspaces.findAll({ limit: 3 });
        return res.status(200).send(workspaces);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const workspaceStructure = async (workspaces) => {
  return await Promise.all(
    workspaces.map(async ({ dataValues: workspace }) => {
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
      return { ...workspace, ratings, host, spaceType, assets };
    })
  );
};
module.exports = {
  getWorkspacesList,
  getWorkspacesByUserId,
  createNewWorkspace,
  editWorkspace,
  searchWorkspaces,
  getWorkspacesByHostId,
  deleteWorkspace,
  getUserFavoriteWorkspaces,
  getUserRecommendations,
};
