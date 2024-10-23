const prisma = require("../config/prisma");

/**
 * @swagger
 * tags:
 *   name: SalleConsultation
 *   description: API endpoints for SalleConsultation management
 *
 * /api/v1/salle-consultation:
 *   post:
 *     summary: Create a new salle consultation
 *     tags: [SalleConsultation]
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
 *               numero:
 *                 type: string
 *               disponibilite:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Salle consultation created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 */

async function addSalleConsultation(req, res) {
  const { numero, disponibilite = true } = req.body;
  try {
    if (!numero) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    await prisma.salleConsultation.create({
      data: { numero, disponibilite },
      include: {
        machines: true,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Salle consultation created successfully",
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
 * @swagger
 * /api/v1/salle-consultation:
 *   get:
 *     summary: Get all salle consultations
 *     tags: [SalleConsultation]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
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
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *     responses:
 *       200:
 *         description: List of salle consultations
 *       500:
 *         description: Bad Request
 */
async function getSallesConsultation(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const sallesConsultation = await prisma.salleConsultation.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });
    return res.status(200).json({
      success: true,
      data: sallesConsultation,
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
 * @swagger
 * /api/v1/salle-consultation/{id}:
 *   put:
 *     summary: Update a salle consultation by ID
 *     tags: [SalleConsultation]
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
 *         description: ID of the salle consultation to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: string
 *               disponibilite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Salle consultation updated successfully
 *       404:
 *         description: Salle consultation not found
 *       500:
 *         description: Bad Request
 */
async function updateSalleConsultation(req, res) {
  const { id } = req.params;
  const { numero, disponibilite } = req.body;
  try {
    const existingSalleConsultation = await prisma.salleConsultation.findUnique(
      {
        where: { id },
      }
    );
    if (!existingSalleConsultation) {
      return res.status(404).json({
        success: false,
        error: "Salle consultation not found",
      });
    }
    const dataToUpdate = {};
    if (numero) dataToUpdate.numero = numero;
    if (disponibilite) dataToUpdate.disponibilite = disponibilite;
    await prisma.salleConsultation.update({
      where: { id },
      data: dataToUpdate,
    });
    return res.status(200).json({
      success: true,
      message: "Salle consultation updated successfully",
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
 * @swagger
 * /api/v1/salle-consultation/{id}:
 *   delete:
 *     summary: Delete a salle consultation by ID
 *     tags: [SalleConsultation]
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
 *         description: ID of the salle consultation to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salle consultation deleted successfully
 *       404:
 *         description: Salle consultation not found
 *       500:
 *         description: Bad Request
 */
async function deleteSalleConsultation(req, res) {
  const { id } = req.params;
  try {
    const existingSalleConsultation = await prisma.salleConsultation.findUnique(
      {
        where: { id },
      }
    );
    if (!existingSalleConsultation) {
      return res.status(404).json({
        success: false,
        error: "Salle consultation not found",
      });
    }
    await prisma.salleConsultation.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "Salle consultation deleted successfully",
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
  addSalleConsultation,
  getSallesConsultation,
  updateSalleConsultation,
  deleteSalleConsultation,
};
