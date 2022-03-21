const { DataTypes } = require("@sequelize/core");

module.exports = (sequelize) => {
  sequelize.define(
    "workspaces",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      host_id: {
        type: DataTypes.BIGINT,
      },
      location_x: {
        type: DataTypes.DOUBLE,
      },
      location_y: {
        type: DataTypes.DOUBLE,
      },
      cost_per_hour: {
        type: DataTypes.INTEGER,
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
      wifi: {
        type: DataTypes.BOOLEAN,
      },
      disabled_access: {
        type: DataTypes.BOOLEAN,
      },
      space_type_id: {
        type: DataTypes.BIGINT,
      },
      smoke_friendly: {
        type: DataTypes.BOOLEAN,
      },
      photo: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    }
  );
};
