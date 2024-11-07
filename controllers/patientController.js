const prisma = require("../config/prisma");
const validator = require("validator");
const { formatDate } = require("../utils/dateFormatter");

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/add:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
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
 *               dateNaissance:
 *                 type: string
 *                 example: 1990-01-01
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */
async function addPatient(req, res) {
  const { nom, prenom, dateNaissance, adresse, telephone, email } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email",
      });
    }
    if (!nom || !prenom || !dateNaissance || !adresse || !telephone || !email) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    if (!validator.isDate(dateNaissance, { format: "YYYY-MM-DD" })) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }
    const formattedDateNaissance = formatDate(dateNaissance);
    await prisma.patient.create({
      data: {
        nom,
        prenom,
        dateNaissance: formattedDateNaissance,
        adresse,
        telephone,
        email,
      },
    });
    res.status(201).json({
      success: true,
      message: "Patient created successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/all:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of patients
 *       500:
 *         description: Bad Request
 *
 */
async function getAllPatients(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const patients = await prisma.patient.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
      orderBy: { createdAt: "desc" },
    });
    const totalPatients = await prisma.patient.count();
    const hasMore = page * limit < totalPatients;
    res.status(200).json({
      success: true,
      data: patients,
      hasMoreData: hasMore,
      total: totalPatients,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
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
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Patient details
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Bad Request
 *
 */
async function getPatientById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { documents: true, factures: true, rendezVous: true },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patients]
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
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */
async function deletePatient(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  try {
    await prisma.patient.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patients]
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
 *         description: The ID of the patient
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
 *               dateNaissance:
 *                 type: string
 *                 example: 1990-01-01
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 *
 */
async function updatePatient(req, res) {
  const { id } = req.params;
  const { nom, prenom, dateNaissance, adresse, telephone, email } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Id is required",
    });
  }
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email",
    });
  }

  try {
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }
    let dataToUpdate = {};
    if (dateNaissance) {
      if (!validator.isDate(dateNaissance, { format: "YYYY-MM-DD" })) {
        return res.status(400).json({
          success: false,
          error: "Invalid date, format must be yyyy-mm-dd",
        });
      }
      const formattedDateNaissance = formatDate(dateNaissance);
      dataToUpdate.dateNaissance = formattedDateNaissance;
    }
    dataToUpdate = {
      nom: nom ? nom : existingPatient.nom,
      prenom: prenom ? prenom : existingPatient.prenom,
      adresse: adresse ? adresse : existingPatient.adresse,
      telephone: telephone ? telephone : existingPatient.telephone,
      email: email ? email : existingPatient.email,
    };
    await prisma.patient.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/search:
 *   get:
 *     summary: Search patients
 *     tags: [Patients]
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
 *         description: The page number
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of patients per page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of patients
 *       500:
 *         description: Bad Request
 *
 */
async function searchPatients(req, res) {
  const { query, page = 1, limit = 10 } = req.query;
  try {
    const patients = await prisma.patient.findMany({
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
    const totalPatients = await prisma.patient.count();
    const hasMore = page * limit < totalPatients;
    res.status(200).json({
      success: true,
      data: patients,
      hasMoreData: hasMore,
      total: totalPatients,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  searchPatients,
};
