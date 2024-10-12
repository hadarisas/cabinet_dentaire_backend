const prisma = require("../config/prisma");
const validator = require("validator");

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: The patient's last name
 *               prenom:
 *                 type: string
 *                 description: The patient's first name
 *               dateNaissance:
 *                 type: string
 *                 description: The patient's birth date
 *               adresse:
 *                 type: string
 *                 description: The patient's address
 *               telephone:
 *                 type: string
 *                 description: The patient's phone number
 *               email:
 *                 type: string
 *                 description: The patient's email
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
    await prisma.patient.create({
      data: { nom, prenom, dateNaissance, adresse, telephone, email },
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
 * /api/v1/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 *       500:
 *         description: Internal server error
 *
 */
async function getAllPatients(req, res) {
  try {
    const patients = await prisma.patient.findMany();
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
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the patient
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
  if (!nom || !prenom || !dateNaissance || !adresse || !telephone || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const dataToUpdate = {
      nom: nom ? nom : existingPatient.nom,
      prenom: prenom ? prenom : existingPatient.prenom,
      dateNaissance: dateNaissance
        ? dateNaissance
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

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
};
