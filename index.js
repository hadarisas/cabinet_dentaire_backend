const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/users", authRoutes);

app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

app.listen(port);
