const express = require("express");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const setupSwagger = require("./swagger");

const app = express();
setupSwagger(app);

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

app.listen(port);
