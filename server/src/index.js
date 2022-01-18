const express = require('express')
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index')

const app = express()
app.use(indexRouter)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8000, () => console.log("Server running on port 8000"))