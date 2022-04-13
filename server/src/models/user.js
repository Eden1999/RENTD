const { DataTypes } = require("@sequelize/core");

module.exports = (sequelize) => {
  sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      is_host: {
        type: DataTypes.BOOLEAN,
      },
      password: {
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
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
