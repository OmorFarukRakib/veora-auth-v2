const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userHandler = require("./routeHandler/userHandler");
const cookieParser = require("cookie-parser");
// express app initialization
const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// mongoose.connect(dbConfig, { useNewUrlParser: true })
//     .then(() => console.log('Connected to MongoDB atlas'))
//     .catch(err => console.error('Error connecting to MongoDB atlas', err));

app.use("/user", userHandler);

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Hello World!  with get request");
});
app.post("/", (req, res) => {
  console.log(JSON.stringify(req.body));
  console.log(req.body);
  const ok = {
    status: "ok",
    body: req.body,
  };

  res.send(ok);
});

const port = process.env.PORT || 3000;
mongoose
  // .connect("mongodb://127.0.0.1:27017/veora", {
  .connect(`${process.env.MONGO_ATLAS_CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .then(() => console.log("database connected"));
