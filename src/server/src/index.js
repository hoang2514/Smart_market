const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const route = require("./routers");
const db = require("./config/db");

const app = express();

//MongoDB
db.connect();

// app config
app.use(cors());
app.use(express.json());

//Routers
route(app);

//PORT 8000
app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000");
});
