const { DataTypes } = require('@sequelize/core');

module.exports = (sequelize) => {
    sequelize.define('orders', {
        id: {
            autoIncrement: true,
            primaryKey : true,
            type: DataTypes.BIGINT
        },
        user_id: {
            type: DataTypes.BIGINT
        },
        workspace_id : {
            type: DataTypes.BIGINT
        },
        date : {
            type : DataTypes.DATE
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
}

