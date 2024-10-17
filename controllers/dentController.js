const prisma = require("../config/prisma");

/**
 * @swagger
 * tags:
 *   name: Dents
 *   description: API endpoints for managing dents
 *
 * /api/v1/dents:
 *   post:
 *     summary: Create a new dent
 *     tags: [Dents]
 *     description: Create a new dent
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *                 description: The code of the dent
 *               position:
 *                 type: string
 *                 description: The position of the dent
 *     responses:
 *       201:
 *         description: Dent created successfully
 *       500:
 *         description: Internal server error
 *       400:
 *         description: Bad request
 */

async function addDent(req, res) {
  try {
    const { code, position } = req.body;
    if (!code || !position) {
      return res
        .status(400)
        .json({ message: "Code and position are required" });
    }
    await prisma.dent.create({
      data: { code: code, position: position },
    });
    res.status(201).json({ message: "Dent added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/dents/{code}:
 *   get:
 *     summary: Get a dent by code
 *     tags: [Dents]
 *     description: Get a dent by code
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token for authentication
 *       - in: path
 *         name: code
 *         schema:
 *           type: number
 *         required: true
 *         description: The code of the dent to retrieve
 *     responses:
 *       200:
 *         description: Dent retrieved successfully
 *       404:
 *         description: Dent not found
 *       500:
 *         description: Internal server error
 */

async function getDentById(req, res) {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }
    const dent = await prisma.dent.findUnique({
      where: { code: Number(code) },
    });
    res.status(200).json(dent);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/dents/{code}:
 *   put:
 *     summary: Update a dent by code
 *     tags: [Dents]
 *     description: Update a dent by code
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token for authentication
 *       - in: path
 *         name: code
 *         schema:
 *           type: number
 *         required: true
 *         description: The code of the dent to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *                 description: The position of the dent
 *     responses:
 *       200:
 *         description: Dent updated successfully
 *       404:
 *         description: Dent not found
 *       500:
 *         description: Internal server error
 *       400:
 *         description: Bad request
 */
async function updateDent(req, res) {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }
    const { position } = req.body;
    if (!position) {
      return res.status(400).json({ message: "Position is required" });
    }
    await prisma.dent.update({
      where: { code: Number(code) },
      data: { position: position },
    });
    res.status(200).json({ message: "Dent updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/dents/{code}:
 *   delete:
 *     summary: Delete a dent by code
 *     tags: [Dents]
 *     description: Delete a dent by code
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token for authentication
 *       - in: path
 *         name: code
 *         schema:
 *           type: number
 *         required: true
 *         description: The code of the dent to delete
 *     responses:
 *       200:
 *         description: Dent deleted successfully
 *       404:
 *         description: Dent not found
 *       500:
 *         description: Internal server error
 *       400:
 *         description: Bad request
 */
async function deleteDent(req, res) {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }
    const dent = await prisma.dent.findUnique({
      where: { code: Number(code) },
    });
    if (!dent) {
      return res.status(404).json({ message: "Dent not found" });
    }
    await prisma.dent.delete({ where: { code: Number(code) } });
    res.status(200).json({ message: "Dent deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/dents:
 *   get:
 *     summary: Get all dents
 *     tags: [Dents]
 *     description: Get all dents
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token for authentication
 *     responses:
 *       200:
 *         description: Dents retrieved successfully
 *       500:
 *         description: Internal server error
 */
async function getDents(req, res) {
  try {
    const dents = await prisma.dent.findMany();
    res.status(200).json(dents);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addDent,
  getDentById,
  updateDent,
  deleteDent,
  getDents,
};
