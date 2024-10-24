const prisma = require("../config/prisma");
const validator = require("validator");

const {
  calculateTotalAmount,
  generateInvoiceNumber,
} = require("../utils/helper");
const { formatDate } = require("../utils/dateFormatter");

/**
 *
 * @swagger
 * /api/v1/factures:
 *   post:
 *     summary: Create a facture
 *     tags: [Factures]
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
 *               patientId:
 *                 type: string
 *                 description: The id of the patient
 *               methodPaiement:
 *                 type: string
 *                 description: The method of payment
 *               dateEcheance:
 *                 type: string
 *                 description: The due date of the facture
 *                 example: 2024-10-24
 *               factureSoins:
 *                 type: array
 *                 description: The facture soins
 *     responses:
 *       200:
 *         description: Facture created successfully
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (All fields are required)
 *       404:
 *         description: Patient not found
 */

async function createFacture(req, res) {
  try {
    const { patientId, methodPaiement, dateEcheance, factureSoins } = req.body;

    if (!patientId || !methodPaiement || !dateEcheance) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    const numeroFacture = await generateInvoiceNumber();

    const montantTotal = calculateTotalAmount(factureSoins);

    if (!validator.isDate(dateEcheance, { format: "YYYY-MM-DD" })) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }
    const formatteddateEcheance = formatDate(dateEcheance);

    const newFacture = await prisma.$transaction(async (prisma) => {
      const facture = await prisma.facture.create({
        data: {
          numeroFacture,
          date: new Date().toISOString(),
          montant: montantTotal,
          statut: "EN_ATTENTE",
          methodPaiement,
          dateEcheance: formatteddateEcheance,
          patientId,
          ...(factureSoins &&
            factureSoins.length > 0 && {
              factureSoins: {
                create: factureSoins.map((fs) => ({
                  soinId: fs.soinId,
                  montant: fs.montant,
                })),
              },
            }),
        },
        include: {
          factureSoins: true,
          patient: true,
        },
      });

      return facture;
    });

    res.status(200).json({
      success: true,
      data: newFacture,
    });
  } catch (error) {
    console.error("Error creating facture:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create facture",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/patient/{patientId}:
 *    get:
 *     summary: Get factures
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: patientId
 *         type: string
 *         description: The id of the patient
 *     responses:
 *       200:
 *         description: Factures fetched successfully
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (PatientId is required)
 *       404:
 *         description: Patient not found
 */
async function getFactures(req, res) {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: "PatientId is required",
      });
    }
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    const factures = await prisma.facture.findMany({
      where: { patientId },
      include: {
        patient: true,
        factureSoins: {
          include: {
            soin: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: factures,
    });
  } catch (error) {
    console.error("Error getting factures:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get factures",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/{id}:
 *   get:
 *     summary: Get facture by id
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture
 *     responses:
 *       200:
 *         description: Facture fetched successfully
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (Id is required)
 *       404:
 *         description: Facture not found
 */
async function getFactureById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }

    const facture = await prisma.facture.findUnique({
      where: { id },
      include: {
        patient: true,
        factureSoins: {
          include: {
            soin: true,
          },
        },
      },
    });

    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }

    res.status(200).json({
      success: true,
      data: facture,
    });
  } catch (error) {
    console.error("Error getting facture:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get facture",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/{id}:
 *   put:
 *     summary: Update a facture
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 description: The status of the facture
 *               methodPaiement:
 *                 type: string
 *                 description: The method of payment
 *               dateEcheance:
 *                 type: string
 *                 description: The due date of the facture
 *                 example: 2024-10-24
 *               soins:
 *                 type: array
 *                 description: The soins of the facture
 *     responses:
 *       200:
 *         description: Facture updated successfully
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (Id is required)
 *       404:
 *         description: Facture not found
 */
async function updateFacture(req, res) {
  try {
    const { id } = req.params;
    const { statut, methodPaiement, dateEcheance, soins } = req.body;

    const dataToUpdate = {};

    const facture = await prisma.facture.findUnique({
      where: { id },
    });
    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }

    if (statut) dataToUpdate.statut = statut;
    if (methodPaiement) dataToUpdate.methodPaiement = methodPaiement;
    if (dateEcheance) {
      if (!validator.isDate(dateEcheance, { format: "YYYY-MM-DD" })) {
        return res.status(400).json({
          success: false,
          error: "Invalid date, format must be yyyy-mm-dd",
        });
      }
      const formatteddateEcheance = formatDate(dateEcheance);
      dataToUpdate.dateEcheance = formatteddateEcheance;
    }

    const updatedFacture = await prisma.facture.update({
      where: { id },
      data: {
        ...dataToUpdate,
        factureSoins: {
          ...(soins && {
            connect: soins.map((soinId) => ({
              soinId,
            })),
          }),
        },
      },
      include: {
        factureSoins: true,
        patient: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedFacture,
    });
  } catch (error) {
    console.error("Error updating facture:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update facture",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/{id}:
 *   delete:
 *     summary: Delete a facture
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture
 *     responses:
 *       200:
 *         description: Facture deleted successfully
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (Id is required)
 *       404:
 *         description: Facture not found
 */
async function deleteFacture(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }
    const facture = await prisma.facture.findUnique({
      where: { id },
    });
    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }

    await prisma.facture.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Facture deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting facture:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete facture",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/en-retard:
 *   get:
 *     summary: Get factures en retard
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *     responses:
 *       200:
 *         description: Factures en retard fetched successfully
 *       500:
 *         description: Bad Request
 */
async function getFacturesEnRetard(req, res) {
  try {
    const facturesEnRetard = await prisma.facture.findMany({
      where: {
        dateEcheance: {
          lt: new Date(),
        },
        statut: {
          not: "PAYE",
        },
      },
      include: {
        patient: true,
        factureSoins: {
          include: {
            soin: true,
          },
        },
      },
      orderBy: {
        dateEcheance: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: facturesEnRetard,
    });
  } catch (error) {
    console.error("Error getting factures en retard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get factures en retard",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/factures/mark-as-paid/{id}:
 *   put:
 *     summary: Mark a facture as paid
 *     tags: [Factures]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture
 *     responses:
 *       200:
 *         description: Facture marked as paid
 *       500:
 *         description: Bad Request
 *       400:
 *         description: Bad Request (Id is required)
 *       404:
 *         description: Facture not found
 */
async function markAsPaid(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }

    const facture = await prisma.facture.findUnique({
      where: { id },
    });
    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }

    await prisma.facture.update({
      where: { id },
      data: { statut: "PAYE" },
    });
    res.status(200).json({
      success: true,
      message: "Facture marked as paid",
    });
  } catch (error) {
    console.error("Error marking facture as paid:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark facture as paid",
    });
  }
}

module.exports = {
  createFacture,
  getFactures,
  getFactureById,
  updateFacture,
  deleteFacture,
  getFacturesEnRetard,
  markAsPaid,
};
