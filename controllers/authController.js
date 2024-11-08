const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for Authentication management
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "hadarisas@gmail.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */

//Send a cookie with the token
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }
    if (user.statut === "INACTIVE") {
      return res.status(401).json({
        success: false,
        error: "User is inactive",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      signed: true,
    });
    const roles = user.roles ? user.roles.map((role) => role.nom) : [];
    const dataToSend = {
      message: "Login successful",
      id: user.id,
      token: token,
      roles: roles,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      numeroTelephone: user.numeroTelephone,
    };

    res.status(200).json({
      success: true,
      data: dataToSend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

module.exports = {
  login,
};
