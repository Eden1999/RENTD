const { sequelize } = require("../config/sequelize");
const jwt = require("jsonwebtoken");

const getRatingsByWorkspaceId = (req, res) => {
  const { workspaceId } = req.params;

  sequelize.models.ratings
      .findAll({
        where: {
          workspace_id: workspaceId,
        },
      })
      .then((ratings) => {
        if (ratings) {
          return res.status(200).send(ratings);
        } else {
          let err = "ratings not found";
          console.log(err);
          return res.status(500).send(err);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err.message);
      });
}

const createNewRating = (req, res) => {
    const { token } = req.headers;
  const {
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
            return res.status(200).send({message : 'Review successfully added!', addedRating});
          })
          .catch((err) => {
            console.log(err);
            return res.status(err?.message === 'Validation error' ? 200 : (err.status || 500)).send(err?.message === 'Validation error' ? 
             {message : 'You already reviewed this place!'} : (err.message || err.errors[0].message));
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

module.exports = { getRatingsByWorkspaceId, createNewRating }