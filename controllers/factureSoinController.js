const prisma = require("../config/prisma");

/**
 *
 * @swagger
 * tags:
 *   name: FactureSoins
 *   description: API endpoints for managing facture soins
 *
 * /api/v1/facture-soins:
 *   post:
 *     summary: Add a facture soin
 *     tags: [FactureSoins]
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
 *               factureId:
 *                 type: string
 *                 description: The id of the facture
 *               soinId:
 *                 type: string
 *                 description: The id of the soin
 *               montant:
 *                 type: number
 *                 description: The montant of the facture soin
 *     responses:
 *       201:
 *         description: FactureSoin created successfully
 *       500:
 *         description: Bad Request
 *       404:
 *         description: Facture or Soin not found
 *       400:
 *         description: Bad Request (Montant must be a number greater than 0)
 *
 */
async function createFactureSoin(req, res) {
  try {
    const { factureId, soinId, montant } = req.body;

    if (!factureId || !soinId || !montant) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    const facture = await prisma.facture.findUnique({
      where: { id: factureId },
    });
    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }
    if (typeof montant !== "number" || montant <= 0) {
      return res.status(400).json({
        success: false,
        error: "Montant must be a number greater than 0",
      });
    }
    const soin = await prisma.soin.findUnique({
      where: { code: soinId },
    });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }

    const newFactureSoin = await prisma.factureSoin.create({
      data: {
        factureId,
        soinId,
        montant,
      },
      include: {
        facture: true,
        soin: true,
      },
    });

    // Update the total amount of the facture
    await prisma.facture.update({
      where: { id: factureId },
      data: {
        montant: {
          increment: montant,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: newFactureSoin,
    });
  } catch (error) {
    console.error("Error creating factureSoin:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create factureSoin",
    });
  }
}

/**
 *
 * @swagger
 *
 * /api/v1/facture-soins/{factureId}:
 *   get:
 *     summary: Get facture soins by facture id
 *     tags: [FactureSoins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: factureId
 *         type: string
 *         description: The id of the facture
 *     responses:
 *       200:
 *         description: FactureSoins fetched successfully
 *       500:
 *         description: Bad Request
 *       404:
 *         description: Facture not found
 *       400:
 *         description: Bad Request (FactureId is required)
 */

async function getFactureSoins(req, res) {
  try {
    const { factureId } = req.params;

    if (!factureId) {
      return res.status(400).json({
        success: false,
        error: "FactureId is required",
      });
    }
    const facture = await prisma.facture.findUnique({
      where: { id: factureId },
    });
    if (!facture) {
      return res.status(404).json({
        success: false,
        error: "Facture not found",
      });
    }
    const factureSoins = await prisma.factureSoin.findMany({
      where: {
        factureId,
      },
      include: {
        soin: true,
      },
    });

    res.status(200).json({
      success: true,
      data: factureSoins,
    });
  } catch (error) {
    console.error("Error getting factureSoins:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get factureSoins",
    });
  }
}

/**
 *
 * @swagger
 *
 * /api/v1/facture-soins/{id}:
 *   put:
 *     summary: Update a facture soin
 *     tags: [FactureSoins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture soin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *                 description: The montant of the facture soin
 *     responses:
 *       200:
 *         description: FactureSoin updated successfully
 *       500:
 *         description: Bad Request
 *       404:
 *         description: FactureSoin not found
 *       400:
 *         description: Bad Request (Id and montant are required)
 */
async function updateFactureSoin(req, res) {
  try {
    const { id } = req.params;
    const { montant } = req.body;

    if (!id || !montant) {
      return res.status(400).json({
        success: false,
        error: "Id and montant are required",
      });
    }
    const originalFactureSoin = await prisma.factureSoin.findUnique({
      where: { id },
    });
    if (!originalFactureSoin) {
      return res.status(404).json({
        success: false,
        error: "FactureSoin not found",
      });
    }

    const updatedFactureSoin = await prisma.$transaction(async (prisma) => {
      // Update the factureSoin
      const updated = await prisma.factureSoin.update({
        where: { id },
        data: { montant },
        include: {
          facture: true,
          soin: true,
        },
      });

      const difference = montant - originalFactureSoin.montant;
      await prisma.facture.update({
        where: { id: updated.factureId },
        data: {
          montant: {
            increment: difference,
          },
        },
      });

      return updated;
    });

    res.status(200).json({
      success: true,
      data: updatedFactureSoin,
    });
  } catch (error) {
    console.error("Error updating factureSoin:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update factureSoin",
    });
  }
}

/**
 *
 * @swagger
 *
 * /api/v1/facture-soins/{id}:
 *   delete:
 *     summary: Delete a facture soin
 *     tags: [FactureSoins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the facture soin
 *     responses:
 *       200:
 *         description: FactureSoin deleted successfully
 *       500:
 *         description: Bad Request (Id is required)
 *       404:
 *         description: FactureSoin not found
 *       400:
 *         description: Bad Request (Id is required)
 */
async function deleteFactureSoin(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }

    const factureSoin = await prisma.factureSoin.findUnique({
      where: { id },
    });
    if (!factureSoin) {
      return res.status(404).json({
        success: false,
        error: "FactureSoin not found",
      });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.factureSoin.delete({
        where: { id },
      });

      await prisma.facture.update({
        where: { id: factureSoin.factureId },
        data: {
          montant: {
            decrement: factureSoin.montant,
          },
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "FactureSoin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting factureSoin:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete factureSoin",
    });
  }
}

/**
 *
 * @swagger
 *
 * /api/v1/facture-soins/summary:
 *   get:
 *     summary: Get facture soins summary
 *     tags: [FactureSoins]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *     responses:
 *       200:
 *         description: FactureSoins summary fetched successfully
 *       500:
 *         description: Bad Request
 */
async function getFactureSoinsSummary(req, res) {
  try {
    const summary = await prisma.factureSoin.groupBy({
      by: ["soinId"],
      _count: {
        _all: true,
      },
      _sum: {
        montant: true,
      },
    });

    const detailedSummary = await Promise.all(
      summary.map(async (item) => {
        const soin = await prisma.soin.findUnique({
          where: { code: item.soinId },
        });
        return {
          ...item,
          soin,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: detailedSummary,
    });
  } catch (error) {
    console.error("Error getting factureSoins summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get factureSoins summary",
    });
  }
}

module.exports = {
  createFactureSoin,
  getFactureSoins,
  updateFactureSoin,
  deleteFactureSoin,
  getFactureSoinsSummary,
};
