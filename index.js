const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const setupSwagger = require("./swagger");
const path = require("path");

const app = express();
setupSwagger(app);

const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(routes);

app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

app.listen(port);
