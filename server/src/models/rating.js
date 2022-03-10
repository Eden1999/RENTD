const { DataTypes } = require('@sequelize/core');

module.exports = (sequelize) => {
    sequelize.define('ratings', {
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
        rating : {
            type : DataTypes.INTEGER
        },
        comment : {
            type : DataTypes.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
}

