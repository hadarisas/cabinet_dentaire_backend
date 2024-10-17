const prisma = require("../config/prisma");
const { uploadFile } = require("../utils/upload");

/**
 *
 * @swagger
 * tags:
 *   name: Documents
 *   description: API endpoints for managing documents
 *
 * /api/v1/documents/{patientId}:
 *   post:
 *     summary: Add a document
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: patientId
 *         type: string
 *         description: The ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the document
 *               dossierMedicalId:
 *                 type: string
 *                 description: The ID of the medical record
 *               fichier:
 *                 type: file
 *                 description: The file of the document
 *     responses:
 *       200:
 *         description: Document added successfully
 *       400:
 *         description: Error when adding the document
 *       500:
 *         description: Internal server error
 *
 */
async function addDocument(req, res) {
  const { type, dossierMedicalId } = req.body;

  if (!type || !dossierMedicalId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload failed" });
    }
    const uploadResult = await uploadFile(req.file, req.params.patientId);

    if (!uploadResult.success) {
      return res.status(400).json({ message: uploadResult.message });
    }
    const document = await prisma.document.create({
      data: { type, dossierMedicalId, fichier: uploadResult.filePath },
    });
    return res.status(200).json({ message: "Document added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 *
 * @swagger
 * /api/v1/documents/{id}:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: L'ID du document
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: The ID of the patient
 *               type:
 *                 type: string
 *                 description: The type of the document
 *               dossierMedicalId:
 *                 type: string
 *                 description: The ID of the medical record
 *               fichier:
 *                 type: file
 *                 description: The file of the document
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Error when updating the document
 *       500:
 *         description: Internal server error
 */
async function updateDocument(req, res) {
  const { type, dossierMedicalId, patientId } = req.body;

  if (!type || !dossierMedicalId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const dataToUpdate = {};
    if (type) dataToUpdate.type = type;
    if (dossierMedicalId) dataToUpdate.dossierMedicalId = dossierMedicalId;

    if (req.file) {
      const uploadResult = await uploadFile(req.file, patientId);
      if (!uploadResult.success) {
        return res.status(400).json({ message: uploadResult.message });
      }
      dataToUpdate.fichier = uploadResult.filePath;
    }

    await prisma.document.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    return res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 *
 * @swagger
 * /api/v1/documents/{id}:
 *   delete:
 *     summary: Delete a document by its ID
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The ID of the document
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       400:
 *         description: Document ID is required
 *       500:
 *         description: Internal server error
 */
async function deleteDocument(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Document ID is required" });
  }
  try {
    await prisma.document.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 *
 * @swagger
 * /api/v1/documents/{dossierMedicalId}:
 *   get:
 *     summary: Get the documents of a medical record
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: dossierMedicalId
 *         type: string
 *         description: The ID of the medical record
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Internal server error
 */
async function getDocuments(req, res) {
  const { dossierMedicalId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  console.log(`dossierMedicalId: ${dossierMedicalId}`);

  const dossierMedical = await prisma.dossierMedical.findUnique({
    where: { id: dossierMedicalId },
  });
  if (!dossierMedical) {
    return res.status(404).json({ message: "Dossier medical not found" });
  }

  try {
    const documents = await prisma.document.findMany({
      where: { dossierMedicalId },
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 *
 * @swagger
 * /api/v1/documents/id/{id}:
 *   get:
 *     summary: Get a document by its ID
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The ID of the document
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
async function getDocumentById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Document ID is required" });
  }
  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    return res.status(200).json(document);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
};
