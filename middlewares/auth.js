const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      error: "No token provided!",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        error: "Unauthorized!",
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
    if (
      user &&
      (user.roles.some((r) => r.nom === role) ||
        user.roles.some((r) => r.nom === "ADMIN"))
    ) {
      next();
    } else {
      res.status(403).send({
        success: false,
        error: `${role} Required!`,
      });
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

const isDentistOrAssistant = (req, res, next) => {
  if (req.userId) {
    verifyRole(req, res, next, "DENTIST").catch(() => {
      verifyRole(req, res, next, "ASSISTANT");
    });
  } else {
    res.status(403).send({ message: "User ID not found!" });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.signedCookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decoded.id };
    req.userId = decoded.id; // Set req.userId here

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};
const authJwt = {
  verifyToken,
  isAdmin,
  isDentiste,
  isAssistant,
  isDentistOrAssistant,
  authenticateToken,
};

module.exports = authJwt;
