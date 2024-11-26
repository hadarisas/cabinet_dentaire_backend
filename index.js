const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const setupSwagger = require("./swagger");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");

const app = express();
setupSwagger(app);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Configure helmet with custom CSP and CORP settings
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: false, // Disable default CORP to handle it manually
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

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (!req.path.startsWith("/public")) {
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  }
  next();
});

app.use(
  "/public",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "public"))
);

// Make sure express.urlencoded is set before routes
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req, res) => {
  res.send(`Server running at port ${port}`);
});

// Development HTTPS configuration
if (process.env.NODE_ENV !== "production") {
  const options = {
    key: fs.readFileSync("./localhost+2-key.pem"),
    cert: fs.readFileSync("./localhost+2.pem"),
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
  });
} else {
  app.listen(port);
}
