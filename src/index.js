const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello server");
});
routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    // console.log("connect DB success");
  })
  .catch((err) => {
    // console.log(err);
  });

app.listen(port, () => {
  // console.log("server is running in port: ", +port);
});
