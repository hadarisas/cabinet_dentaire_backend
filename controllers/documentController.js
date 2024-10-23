const prisma = require("../config/prisma");
const { uploadFile, deleteFile } = require("../utils/files");

/**
 *
 * @swagger
 * tags:
 *   name: Documents
 *   description: API endpoints for managing documents
 *
 * /api/v1/documents:
 *   post:
 *     summary: Add a document
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
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
 *               description:
 *                 type: string
 *                 description: The description of the document
 *               patientId:
 *                 type: string
 *                 description: The ID of the patient
 *               fichier:
 *                 type: file
 *                 description: The file of the document
 *     responses:
 *       200:
 *         description: Document added successfully
 *       400:
 *         description: Error when adding the document
 *       500:
 *         description: Bad Request
 *
 */
async function addDocument(req, res) {
  const { type, description, patientId } = req.body;

  if (!type || !description || !patientId) {
    return res.status(400).json({
      success: false,
      error: "type, description and patientId are required",
    });
  }

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Upload failed",
      });
    }
    const uploadResult = await uploadFile(req.file, patientId);

    if (!uploadResult.success) {
      return res.status(400).json({
        success: false,
        error: uploadResult.message,
      });
    }
    console.log(`uploadResult.filePath: ${uploadResult.filePath}`);
    const document = await prisma.document.create({
      data: { type, description, patientId, fichier: uploadResult.filePath },
    });
    return res.status(200).json({
      success: true,
      data: document,
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
 *               description:
 *                 type: string
 *                 description: The description of the document
 *               fichier:
 *                 type: file
 *                 description: The file of the document
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Error when updating the document
 *       500:
 *         description: Bad Request
 */
async function updateDocument(req, res) {
  const { type, description, patientId } = req.body;
  try {
    const dataToUpdate = {};
    if (type) dataToUpdate.type = type;
    if (description) dataToUpdate.description = description;
    if (patientId) dataToUpdate.patientId = patientId;
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }
    if (req.file) {
      const uploadResult = await uploadFile(req.file, patientId);
      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          error: uploadResult.message,
        });
      }
      dataToUpdate.fichier = uploadResult.filePath;
    }
    const updatedDocument = await prisma.document.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    return res.status(200).json({
      success: true,
      data: updatedDocument,
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
 *         description: Bad Request
 */
async function deleteDocument(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Document ID is required",
    });
  }
  try {
    //delete file from storage
    const document = await prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }
    const deleteFileResult = await deleteFile(document.fichier);
    if (!deleteFileResult.success) {
      return res.status(400).json({
        success: false,
        error: deleteFileResult.message,
      });
    }
    await prisma.document.delete({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
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
 * /api/v1/documents/patient/{patientId}:
 *   get:
 *     summary: Get the documents of a patient
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
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Bad Request
 */
async function getDocuments(req, res) {
  const { patientId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }
    const documents = await prisma.document.findMany({
      where: { patientId },
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });

    return res.status(200).json({
      success: true,
      data: documents,
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
 * /api/v1/documents/{id}:
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
 *         description: Bad Request
 */
async function getDocumentById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Document ID is required",
    });
  }
  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: document,
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
  addDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
};
