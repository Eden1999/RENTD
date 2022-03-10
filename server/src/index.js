const express = require('express')
var cors = require('cors')
require("dotenv").config();

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const {sequelize} = require('./config/sequelize');


async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.log("Unable to connect to the database:");
		console.log(error.message);
		process.exit(1);
	}
}


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(indexRouter)

app.listen(8000, async () => {
    await assertDatabaseConnectionOk()

    console.log("Server running on port 8000")
})