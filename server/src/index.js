const express = require("express");
var cors = require("cors");
var swaggerJsdoc = require("swagger-jsdoc")
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("../swagger.json");

require("dotenv").config();

const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const { sequelize } = require("./config/sequelize");

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

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(indexRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RENTD Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple API application made with Express and documented with Swagger",
      contact: {
        name: "RENTD",
        url: "http://localhost:3000",
        email: "shirelbar100@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
app.listen(8000, async () => {
  await assertDatabaseConnectionOk();

  console.log("Server running on port 8000");
});
