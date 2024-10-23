const prisma = require("../config/prisma");

/**
 *
 * @swagger
 * tags:
 *   name: Soins
 *   description: API endpoints for managing soins
 *
 * /api/v1/soins:
 *   post:
 *     summary: Add a soin
 *     tags: [Soins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the soin
 *               prix:
 *                 type: number
 *                 description: The price of the soin
 *               categorie:
 *                 type: string
 *                 description: The categorie of the soin
 *     responses:
 *       201:
 *         description: Soin added successfully
 *       500:
 *         description: Bad Request
 */
async function addSoin(req, res) {
  const { description, prix, categorie } = req.body;
  try {
    if (!description || !prix || !categorie) {
      return res.status(400).json({
        success: false,
        error: "description, prix and categorie are required",
      });
    }
    if (typeof prix !== "number" || prix <= 0) {
      return res.status(400).json({
        success: false,
        error: "prix must be a positive number",
      });
    }

    const soin = await prisma.soin.create({
      data: { description, prix, categorie },
    });
    return res.status(201).json({
      success: true,
      message: "Soin added successfully",
      data: soin,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins/{id}:
 *   put:
 *     summary: Update a soin
 *     tags: [Soins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the soin
 *               prix:
 *                 type: number
 *                 description: The price of the soin
 *               categorie:
 *                 type: string
 *                 description: The categorie of the soin
 *     responses:
 *       200:
 *         description: Soin updated successfully
 *       500:
 *         description: Bad Request
 */
async function updateSoin(req, res) {
  const { id } = req.params;
  const { description, prix, categorie } = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "id is required",
      });
    }
    const dataToUpdate = {};
    const soin = await prisma.soin.findUnique({ where: { code: id } });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }
    if (description) dataToUpdate.description = description;
    if (prix) {
      if (typeof prix !== "number" || prix <= 0) {
        return res.status(400).json({
          success: false,
          error: "prix must be a positive number",
        });
      }
      dataToUpdate.prix = prix;
    }
    if (categorie) dataToUpdate.categorie = categorie;

    const updatedSoin = await prisma.soin.update({
      where: { code: id },
      data: dataToUpdate,
    });
    return res.status(200).json({
      success: true,
      message: "Soin updated successfully",
      data: updatedSoin,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins/{id}:
 *   delete:
 *     summary: Delete a soin
 *     tags: [Soins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin
 *     responses:
 *       200:
 *         description: Soin deleted successfully
 *       500:
 *         description: Bad Request
 */
async function deleteSoin(req, res) {
  const { id } = req.params;
  try {
    const soin = await prisma.soin.findUnique({ where: { code: id } });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }
    await prisma.soin.delete({ where: { code: id } });
    return res.status(200).json({
      success: true,
      message: "Soin deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins:
 *   get:
 *     summary: Get all soins
 *     tags: [Soins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *     responses:
 *       200:
 *         description: Soins fetched successfully
 *       500:
 *         description: Bad Request
 */
async function getSoins(req, res) {
  try {
    const soins = await prisma.soin.findMany();
    return res.status(200).json({
      success: true,
      data: soins,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins/{id}:
 *   get:
 *     summary: Get a soin by id
 *     tags: [Soins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin
 *     responses:
 *       200:
 *         description: Soin fetched successfully
 *       500:
 *         description: Bad Request
 */
async function getSoinById(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "id is required",
      });
    }
    const soin = await prisma.soin.findUnique({ where: { code: id } });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: soin,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
module.exports = {
  addSoin,
  updateSoin,
  deleteSoin,
  getSoins,
  getSoinById,
};
