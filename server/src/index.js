const express = require('express')
var cors = require('cors')
require("reflect-metadata")
const typeorm = require("typeorm") 

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index')

const app = express()
app.use(cors())
app.use(indexRouter)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8000, async () => {
    console.log("Server running on port 8000")
    try {
        await typeorm.createConnection()
        console.log('DB connection established successfully')
    } catch (err) {
        console.log('DB connection failed', err)
    }
})