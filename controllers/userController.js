const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: { roles: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    const roles = user.roles ? user.roles.map((role) => role.nom) : [];

    res
      .status(200)
      .json({ message: "Login successful", token: token, roles: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/add:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */
async function addUser(req, res) {
  const { nom, prenom, email, motDePasse, roles } = req.body;
  if (!nom || !prenom || !email || !motDePasse || !roles) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const user = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        roles: { connect: roles.map((role) => ({ nom: role })) },
      },
      include: { roles: true },
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Internal server error
 *
 */
async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await prisma.utilisateur.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */
async function getUserById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const user = await prisma.utilisateur.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */
async function updateUser(req, res) {
  const { id } = req.params;
  const { nom, prenom, email, motDePasse, roles } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (motDePasse) {
      hashedPassword = await bcrypt.hash(motDePasse, 10);
    }
    const dataToUpdate = {
      nom: nom ? nom : existingUser.nom,
      prenom: prenom ? prenom : existingUser.prenom,
      email: email ? email : existingUser.email,
      motDePasse: motDePasse ? hashedPassword : existingUser.motDePasse,
    };
    if (roles) {
      dataToUpdate.roles = { set: [] };
      dataToUpdate.roles = { connect: roles.map((role) => ({ nom: role })) };
    }
    const user = await prisma.utilisateur.update({
      where: { id },
      data: dataToUpdate,
      include: { roles: true },
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */
async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.utilisateur.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  login,
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
