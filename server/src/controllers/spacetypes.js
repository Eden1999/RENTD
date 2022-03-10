const { sequelize } = require("../config/sequelize");

const getSpacetypesList = (req, res) => {
    sequelize.models.space_types.findAll().then((user) => {
        res.send(user).status(200);
    })
    .catch((err) => {
        console.log(err)
    });
}

module.exports = { getSpacetypesList }