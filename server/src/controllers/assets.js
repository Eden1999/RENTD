const { sequelize } = require("../config/sequelize");

const getAssetById = (req, res) => {
    const {id} = req.params;

    console.log(id);
    sequelize.models.assets
        .findOne({where: {id}})
        .then((asset) => {
            if (asset) {
                console.log(`successfuly getting asset ${asset.id}`);
                return res.status(200).send(asset);
            } else {
                let err = "asset not found";
                console.log(err);
                return res.status(500).send(err);
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err);
        });
};

module.exports = { getAssetById }