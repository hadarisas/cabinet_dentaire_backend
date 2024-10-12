const prisma = require("../config/prisma");
const validator = require("validator");

/**
 * @swagger
 * tags:
 *   name: Dossier Medical
 *   description: API endpoints for managing dossier medical
 *
 * /api/v1/dossier-medical/add:
 *   post:
 *     summary: Create a new dossier medical
 *     tags: [Dossier Medical]
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
 *               patientId:
 *                 type: string
 *                 description: The ID of the patient
 *     responses:
 *       201:
 *         description: Dossier medical created successfully
 *       400:
 *         description: Patient ID is required
 *       500:
 *         description: Internal server error
 */

async function addDossierMedical(req, res) {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const dossierMedical = await prisma.dossierMedical.create({
      data: { patientId },
    });

    return res
      .status(201)
      .json({ message: "Dossier medical created", dossierMedical });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
/**
 * @swagger
 * /api/v1/dossier-medical/patient/{patientId}:
 *   get:
 *     summary: Get a dossier medical by patient ID
 *     tags: [Dossier Medical]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Dossier medical retrieved successfully
 *       404:
 *         description: Dossier medical not found
 *       500:
 *         description: Internal server error
 */
async function getDossierMedicalByPatientId(req, res) {
  const { patientId } = req.params;

  try {
    const dossierMedical = await prisma.dossierMedical.findUnique({
      where: { patientId },
    });
    if (!dossierMedical) {
      return res.status(404).json({ message: "Dossier medical not found" });
    }

    return res.status(200).json({ dossierMedical });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/dossier-medical/patient/{patientId}:
 *   put:
 *     summary: Update a dossier medical by patient ID
 *     tags: [Dossier Medical]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: The ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *               soinsEffectues:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Dossier medical updated successfully
 *       400:
 *         description: Patient ID is required
 *       500:
 *         description: Internal server error
 *
 */
async function updateDossierMedical(req, res) {
  const { patientId } = req.params;
  const { documents, soinsEffectues } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }
  const dataToUpdate = {};

  if (documents) {
    dataToUpdate.documents = {
      connect: documents.map((document) => ({ id: document.id })),
    };
  }
  if (soinsEffectues) {
    dataToUpdate.soinsEffectues = {
      connect: soinsEffectues.map((soinEffectue) => ({ id: soinEffectue.id })),
    };
  }

  try {
    const dossierMedical = await prisma.dossierMedical.update({
      where: { patientId },
      data: dataToUpdate,
      include: { documents: true, soinsEffectues: true },
    });

    return res.status(200).json({ dossierMedical });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addDossierMedical,
  getDossierMedicalByPatientId,
  updateDossierMedical,
};
