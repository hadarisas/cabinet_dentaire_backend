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
 *         description: Internal server error
 *
 */
async function addPatient(req, res) {
  const { nom, prenom, dateNaissance, adresse, telephone, email } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!nom || !prenom || !dateNaissance || !adresse || !telephone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isDate(dateNaissance, { format: "YYYY-MM-DD" })) {
      return res
        .status(400)
        .json({ message: "Invalid date, format must be yyyy-mm-dd" });
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
    res.status(201).json({ message: "Patient created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
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
 *         description: Internal server error
 *
 */
async function getAllPatients(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const patients = await prisma.patient.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
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
 *         description: Internal server error
 *
 */
async function getPatientById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
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
 *         description: Internal server error
 *
 */
async function deletePatient(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    await prisma.patient.delete({ where: { id } });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
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
 *         description: Internal server error
 *
 */
async function updatePatient(req, res) {
  const { id } = req.params;
  const { nom, prenom, dateNaissance, adresse, telephone, email } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (
    dateNaissance &&
    !validator.isDate(dateNaissance, { format: "YYYY-MM-DD" })
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date, format must be yyyy-mm-dd" });
  }

  try {
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const formattedDateNaissance = formatDate(dateNaissance);
    const dataToUpdate = {
      nom: nom ? nom : existingPatient.nom,
      prenom: prenom ? prenom : existingPatient.prenom,
      dateNaissance: formattedDateNaissance
        ? formattedDateNaissance
        : existingPatient.dateNaissance,
      adresse: adresse ? adresse : existingPatient.adresse,
      telephone: telephone ? telephone : existingPatient.telephone,
      email: email ? email : existingPatient.email,
    };
    await prisma.patient.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API endpoints for managing patients
 *
 * /api/v1/patients/{id}/dossier-medical:
 *   get:
 *     summary: Get medical record of a patient
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
 *         description: Medical record
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Internal server error
 *
 */
async function getDossierMedical(req, res) {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const medicalRecord = await prisma.dossierMedical.findUnique({
      where: { patientId: id },
    });
    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.status(200).json(medicalRecord);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  getDossierMedical,
};
