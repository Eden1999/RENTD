const Sequelize = require('sequelize');
const { applyExtraSetup } = require('./extra-db-setup');

const database=process.env.PG_DATABASE,
  host=process.env.PG_HOST,
  password=process.env.PG_PASSWORD,
  username=process.env.PG_USERNAME,
  port=process.env.PG_PORT;

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: "postgres",
  define: {
    timestamps: false
  }
});

const modelDefiners = [
	require('../models/orders'),
	require('../models/rating'),
	require('../models/spacetype'),
  require('../models/assettype'),
  require('../models/asset'),
  require('../models/user'),
  require('../models/workspace')
];

// We define all models according to their files.
for (let modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = {sequelize};
