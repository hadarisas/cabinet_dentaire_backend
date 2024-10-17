const express = require("express");
const authRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dentsRoutes = require("./routes/dentRoutes");
const machinesRoutes = require("./routes/machineRoutes");
const produitsRoutes = require("./routes/produitsRoutes");
const rendezVousRoutes = require("./routes/rendezVousRoutes");
const salleConsultationRoutes = require("./routes/salleConsultationRoutes");

const setupSwagger = require("./swagger");

const app = express();
setupSwagger(app);

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/dents", dentsRoutes);
app.use("/api/v1/machines", machinesRoutes);
app.use("/api/v1/produits", produitsRoutes);
app.use("/api/v1/rendez-vous", rendezVousRoutes);
app.use("/api/v1/salle-consultation", salleConsultationRoutes);

app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

app.listen(port);
