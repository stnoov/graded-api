const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();

var corsOptions = {
    origin: "http://localhost:19002"
};

app.use(cors(corsOptions));
app.use(bodyParser.json(({limit: '50mb'})));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const db = require("./models");
require('./routes/auth.routes')(app);
require('./routes/postings.routes')(app);

db.sequelize.sync()

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Testing API." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
