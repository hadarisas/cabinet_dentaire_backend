const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const verifyRole = async (req, res, next, role) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.userId },
      include: { roles: true },
    });
    if (user && user.roles.some((r) => r.nom === role)) {
      next();
    } else {
      res.status(403).send({ message: `${role} Required!` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  verifyRole(req, res, next, "ADMIN");
};
const isDentiste = (req, res, next) => {
  verifyRole(req, res, next, "DENTIST");
};
const isAssistant = (req, res, next) => {
  verifyRole(req, res, next, "ASSISTANT");
};

const authJwt = {
  verifyToken,
  isAdmin,
  isDentiste,
  isAssistant,
};

module.exports = authJwt;
