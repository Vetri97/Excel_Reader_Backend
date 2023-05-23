// server.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const cors = require("cors");

require("dotenv/config");

const fileUploadRouter = require("./route/fileUpload");

// middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("tiny"));

// routers

require("./route/fileUpload")(app);

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
