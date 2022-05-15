const { DataTypes } = require("@sequelize/core");

module.exports = (sequelize) => {
  sequelize.define(
    "assets",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      text: {
        type: DataTypes.STRING,
      },
      asset_id: {
        type: DataTypes.BIGINT,
      },
      workspace_id: {
        type: DataTypes.BIGINT,
      },
      cost_per_hour: {
        type: DataTypes.BIGINT,
      },
      capacity: {
        type: DataTypes.BIGINT,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    }
  );
};
