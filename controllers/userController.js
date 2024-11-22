const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { uploadProfilePicture, deleteFile } = require("../utils/files");

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               numeroTelephone:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               fichier:
 *                 type: file
 *                 description: The user profile image
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 collectionFormat: array
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */
async function addUser(req, res) {
  const userData = JSON.parse(req.body.data);
  const {
    nom,
    prenom,
    email,
    numeroTelephone,
    motDePasse,
    roles,
    statut = "ACTIVE",
  } = userData;

  if (!nom || !prenom || !email || !numeroTelephone || !motDePasse || !roles) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email",
      });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    let userData = {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      numeroTelephone,
      statut,
      roles: {
        connect: roles.map((role) => ({ id: role })),
      },
    };

    const user = await prisma.utilisateur.create({
      data: userData,
      include: { roles: true },
    });

    if (req.file) {
      const uploadResult = await uploadProfilePicture(req.file, user.id);

      if (!uploadResult.success) {
        return res.status(201).json({
          success: true,
          message:
            "User created successfully but profile picture upload failed",
          warning: uploadResult.error,
        });
      }

      await prisma.utilisateur.update({
        where: { id: user.id },
        data: { profilePicture: uploadResult.filePath },
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
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
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of rendez-vous to retrieve per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await prisma.utilisateur.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
      include: { roles: true },
      orderBy: { createdAt: "desc" },
    });
    const totalUsers = await prisma.utilisateur.count();
    const hasMore = page * limit < totalUsers;

    const usersWithoutPassword = users.map((user) => {
      const { motDePasse, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      data: usersWithoutPassword,
      hasMoreData: hasMore,
      total: totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
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
 *         description: Bad Request
 *
 */
async function getUserById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id },
      include: { roles: true },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const { motDePasse, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               numeroTelephone:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 collectionFormat: array
 *               statut:
 *                 type: string
 *               profilePicture:
 *                 type: file
 *                 description: The user profile image
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */
async function updateUser(req, res) {
  const userData = JSON.parse(req.body.data);
  const { id } = req.params;
  const {
    nom,
    prenom,
    email,
    numeroTelephone,
    motDePasse,
    roles,
    statut = "ACTIVE",
  } = userData;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id },
      include: { roles: true },
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    if (motDePasse) {
      hashedPassword = await bcrypt.hash(motDePasse, 10);
    }
    const dataToUpdate = {
      nom: nom ? nom : existingUser.nom,
      prenom: prenom ? prenom : existingUser.prenom,
      email: email ? email : existingUser.email,
      motDePasse: motDePasse ? hashedPassword : existingUser.motDePasse,
      numeroTelephone: numeroTelephone
        ? numeroTelephone
        : existingUser.numeroTelephone,
      statut: statut ? statut : existingUser.statut,
    };

    if (roles) {
      const isRemovingAdminRole =
        existingUser.roles.some((role) => role.nom === "ADMIN") &&
        !roles.includes(
          existingUser.roles.find((role) => role.nom === "ADMIN").id
        );

      if (isRemovingAdminRole) {
        const adminCount = await prisma.utilisateur.count({
          where: {
            roles: {
              some: {
                nom: "ADMIN",
              },
            },
          },
        });
        if (adminCount <= 1) {
          return res.status(403).json({
            success: false,
            error: "Cannot remove the last admin user",
          });
        }
      }
      if (req.file) {
        const uploadResult = await uploadProfilePicture(
          req.file,
          existingUser.id
        );

        if (!uploadResult.success) {
          return res.status(201).json({
            success: false,
            message: "Failed to update profile picture",
            warning: uploadResult.error,
          });
        }
        dataToUpdate.profilePicture = uploadResult.filePath;
      }

      await prisma.utilisateur.update({
        where: { id },
        data: {
          roles: {
            disconnect: existingUser.roles.map((role) => ({ id: role.id })),
          },
        },
      });
      dataToUpdate.roles = { connect: roles.map((role) => ({ id: role })) };
    }

    const user = await prisma.utilisateur.update({
      where: { id },
      data: dataToUpdate,
      include: { roles: true },
    });

    const userRoles = user.roles ? user.roles.map((role) => role.nom) : [];
    const dataToSend = {
      message: "Login successful",
      id: user.id,
      //token: token,
      roles: userRoles,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      numeroTelephone: user.numeroTelephone,
      statut: user.statut,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      success: true,
      message: "User updated successfully",
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
 *         description: Bad Request
 *
 */
async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id },
      include: { roles: true },
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (
      existingUser.roles &&
      existingUser.roles.some((role) => role.nom === "ADMIN")
    ) {
      const adminCount = await prisma.utilisateur.count({
        where: {
          roles: {
            some: {
              nom: "ADMIN",
            },
          },
        },
      });
      if (adminCount <= 1) {
        return res.status(403).json({
          success: false,
          error: "Cannot delete the only admin user",
        });
      }
    }
    const deleteFileResult = await deleteFile(existingUser.profilePicture);
    if (!deleteFileResult.success) {
      return res.status(400).json({
        success: false,
        error: deleteFileResult.message,
      });
    }
    await prisma.utilisateur.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/status/{id}:
 *   put:
 *     summary: Update a user status by ID
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
 *       - in: body
 *         name: statut
 *         required: true
 *         description: The status of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Bad Request
 *
 */
async function updateUserStatus(req, res) {
  const { id } = req.params;
  const { statut } = req.body;
  if (!id || !statut) {
    return res.status(400).json({
      success: false,
      error: "Id and statut are required",
    });
  }
  try {
    const existingUser = await prisma.utilisateur.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    await prisma.utilisateur.update({ where: { id }, data: { statut } });
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for Users management
 *
 * /api/v1/users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of users to retrieve per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function searchUsers(req, res) {
  const { query, page = 1, limit = 10 } = req.query;
  try {
    const users = await prisma.utilisateur.findMany({
      where: {
        OR: [
          { nom: { contains: query } },
          { prenom: { contains: query } },
          { email: { contains: query } },
        ],
      },
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
      orderBy: { createdAt: "desc" },
    });

    const totalUsers = users.length;
    const hasMore = page * limit < totalUsers;

    const usersWithoutPassword = users.map((user) => {
      const { motDePasse, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.status(200).json({
      success: true,
      data: usersWithoutPassword,
      hasMoreData: hasMore,
      total: totalUsers,
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
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  searchUsers,
};
