const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productsRouter = require("./Routes/productsRouter");
const cors = require("cors");

// App Config
const app = express();
const port = process.env.PORT || 3127;
const dbConnection =
  "mongodb+srv://antiquin:antiquin2023@cluster0.ndm1lxd.mongodb.net/antiquin?retryWrites=true&w=majority";

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

// DB Config
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`CONNECTED TO MONGODB!`);
  })
  .catch((err) => {
    console.log(`CAN'T CONNECT TO THE DATABASE!`);
    console.log(err);
  });

// API Endpoints
app.get("/", (req, res) => {
  res.json("Antiquin Server");
});
app.use("/products", productsRouter);

// Listener
app.listen(port, () => console.log(`SERVER IS RUNNING IN PORT ${port}`));
