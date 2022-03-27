const { sequelize } = require("../config/sequelize");
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

const getWorkspacesByHostId = (req, res) => {
  const { hostId } = req.params;

  sequelize.models.workspaces
    .findAll({ where: { host_id: hostId } })
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

// Should validate the user is host
const getWorkspacesByUserId = (req, res) => {};

const createNewWorkspace = (req, res) => {
  const { token } = req.headers;
  const {
    name,
    city,
    address,
    location_x,
    location_y,
    cost_per_hour,
    capacity,
    wifi,
    disabled_access,
    smoke_friendly,
    description,
    space_type_id,
    photo,
    opening_days,
    opening_hour,
    closing_hour
  } = req.body;

  // let openingDate = new Date(opening_hour)
  // let openingHour = date.getHours()
  // let openingMinutes = date.getMinutes()

  // let closingDate = new Date(closing_hour)
  // let closingHour = date.getHours()
  // let closingMinutes = date.getMinutes()

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  let newWorkspace = {
    name,
    city,
    address,
    location_x,
    location_y,
    cost_per_hour,
    capacity,
    wifi,
    disabled_access,
    smoke_friendly,
    description,
    space_type_id,
    photo,
    opening_days,
    opening_hour,
    closing_hour
  };

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        newWorkspace.host_id = user.id;
        sequelize.models.workspaces
          .create(newWorkspace)
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

const editWorkspace = (req, res) => {};

const searchWorkspaces = async (req, res) => {
  try {
    const query = req.body;
    let workspaces = await sequelize.models.workspaces.findAll({ where: query });
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

module.exports = {
  getWorkspacesList,
  getWorkspacesByUserId,
  createNewWorkspace,
  editWorkspace,
  searchWorkspaces,
  getWorkspacesByHostId,
};
