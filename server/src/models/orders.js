const { DataTypes } = require('@sequelize/core');

module.exports = (sequelize) => {
    sequelize.define('orders', {
        id: {
            autoIncrement: true,
            primaryKey : true,
            type: DataTypes.BIGINT
        },
        startdate: {
            type: DataTypes.DATE
        },
        enddate: {
            type: DataTypes.DATE
        },
        available : {
            type: DataTypes.BOOLEAN
        },
        capacity: {
            type : DataTypes.BIGINT
        },
        workspace_id : {
            type : DataTypes.BIGINT
        },
        user_id : {
            type : DataTypes.BIGINT
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
}

