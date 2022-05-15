const { sequelize } = require("../config/sequelize");

const getAssetTypesList = (req, res) => {
    sequelize.models.asset_types.findAll().then((user) => {
        res.send(user).status(200);
    })
    .catch((err) => {
        console.log(err)
    });
}

module.exports = { getAssetTypesList }