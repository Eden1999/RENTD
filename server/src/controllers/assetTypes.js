const { sequelize } = require("../config/sequelize");

const getAssetTypesList = (req, res) => {
    sequelize.models.asset_types.findAll().then((assets) => {
        res.send(assets).status(200);
    })
    .catch((err) => {
        console.log(err)
    });
}

module.exports = { getAssetTypesList }