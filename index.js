const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const setupSwagger = require("./swagger");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();
setupSwagger(app);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

const corsOptions = {
  origin: "http://localhost:8080",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: [
    "Cross-Origin-Resource-Policy",
    "Cross-Origin-Opener-Policy",
  ],
};

app.use(
  "/public",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "public"))
);
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(routes);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

app.listen(port);
