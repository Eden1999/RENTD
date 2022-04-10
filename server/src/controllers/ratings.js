const { sequelize } = require("../config/sequelize");
const jwt = require("jsonwebtoken");

const getRatingsByWorkspaceId = (req, res) => {

}

const getRatingsByUserId = (req, res) => {

}

const createNewRating = (req, res) => {
    const { token } = req.headers;
  const {
    user_id,
    workspace_id,
    rating,
    comment
  } = req.body;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  let newRating = {
    workspace_id,
    rating,
    comment
  };

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        newRating.user_id = user.id;
        sequelize.models.ratings
          .create(newRating)
          .then((addedRating) => {
            addedRating.dataValues.user = user.dataValues;
            return res.status(200).send(addedRating);
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
}

module.exports = { getRatingsByWorkspaceId, getRatingsByUserId, createNewRating }