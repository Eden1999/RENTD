const { sequelize } = require("../config/sequelize");
const { Op } = require("@sequelize/core");
const jwt = require("jsonwebtoken");

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
            return { ...workspace, ratings, host, spaceType };
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

const getUserFavoriteWorkspaces = (req,res) => {
    const {token} = req.headers;

    const decodeId = jwt.verify(token, process.env.SECRET_KEY);

    // check if user exists
    sequelize.models.users
    .findOne({where: {id: decodeId}})
    .then(async (user) => {
        if (user) {
            sequelize.models.workspaces
            .findAll({ where: { id: {[Op.in] : user?.dataValues?.favorite_workspaces || []} }})
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
                    return { ...workspace, ratings, host, spaceType };
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

  // let openingDate = new Date(opening_hour)
  // let openingHour = date.getHours()
  // let openingMinutes = date.getMinutes()

  // let closingDate = new Date(closing_hour)
  // let closingHour = date.getHours()
  // let closingMinutes = date.getMinutes()

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        workspace.host_id = user.id;
        sequelize.models.workspaces
          .create(workspace)
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

const editWorkspace = (req, res) => {
  const { workspaceId } = req.params;

  const { token } = req.headers;
  const { workspace } = req.body;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        sequelize.models.workspaces
          .update(workspace, { where: { id: workspaceId } })
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

const searchWorkspaces = async (req, res) => {
  try {
    const { city, capacity, space_type_id } = req.query;
    console.log(city);
    console.log(capacity);
    let workspaces = await sequelize.models.workspaces.findAll({
      where: {
        city: city,
        space_type_id: space_type_id,
        capacity: {
          [Op.gte]: capacity,
        },
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
        return { ...workspace, ratings, host, spaceType };
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

module.exports = {
  getWorkspacesList,
  getWorkspacesByUserId,
  createNewWorkspace,
  editWorkspace,
  searchWorkspaces,
  getWorkspacesByHostId,
  deleteWorkspace,
  getUserFavoriteWorkspaces
};
