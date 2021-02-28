const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const { cloudinary } = require('./middleware/cloudinary')
const app = express();

var corsOptions = {
    origin: "http://localhost:19002"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./models");
require('./routes/auth.routes')(app);
require('./routes/postings.routes')(app);

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Testing API." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
