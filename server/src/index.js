const express = require('express')
var cors = require('cors')

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index')

const app = express()
app.use(cors())
app.use(indexRouter)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8000, () => console.log("Server running on port 8000"))