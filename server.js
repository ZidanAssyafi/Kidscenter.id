const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const auth = require("./middleware/authMiddleware");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));

app.get("/health", (req, res) => {
  res.send("API is running");
});

//nanti tambahin route user profile pake auth middleware
//app.get("/api/user", auth, (req, res) => {
  //res.json({
    //msg: "User data accessed",
    //user: req.user
  //});
//});

app.listen(5000, () => console.log("Server running"));