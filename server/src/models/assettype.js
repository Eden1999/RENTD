const { DataTypes } = require('@sequelize/core');

module.exports = (sequelize) => {
    sequelize.define('asset_types', {
        id: {
            autoIncrement: true,
            primaryKey : true,
            type: DataTypes.BIGINT
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
}

