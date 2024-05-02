require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const userAuthRoute = require("./routes/userAuth");
const storiesRoute = require("./routes/stories");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "https://swiptoryweb.netlify.app",
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("DB Failed to Connect", error));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/userauth", userAuthRoute);
app.use("/api/story", storiesRoute);

app.get("/api/health", (req, res) => {
  console.log("Server health is Excellent");
  res.json({
    service: "Backend Web Stories Server",
    status: "active",
    time: new Date(),
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
