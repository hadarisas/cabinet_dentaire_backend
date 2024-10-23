const prisma = require("../config/prisma");
const { formatDate } = require("../utils/dateFormatter");
const validator = require("validator");

/**
 *
 * @swagger
 * tags:
 *   name: SoinsEffectues
 *   description: API endpoints for managing soins effectues
 *
 * /api/v1/soins-effectues:
 *   post:
 *     summary: Add a soin effectue
 *     tags: [SoinsEffectues]
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
 *               date:
 *                 type: string
 *                 description: The date of the soin
 *               commentaire:
 *                 type: string
 *                 description: The commentaire of the soin
 *               soinId:
 *                 type: string
 *                 description: The id of the soin
 *               dentId:
 *                 type: string
 *                 description: The id of the dent
 *               rendezVousId:
 *                 type: string
 *                 description: The id of the rendez-vous
 *               factureId:
 *                 type: string
 *                 description: The id of the facture
 *     responses:
 *       201:
 *         description: SoinEffectue created successfully
 *       500:
 *         description: Bad Request
 *
 */
async function createSoinEffectue(req, res) {
  const { date, commentaire, soinId, dentId, rendezVousId, factureId } =
    req.body;
  try {
    if (!validator.isDate(date, { format: "YYYY-MM-DD" })) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }

    const formatedDate = formatDate(date);
    if (!soinId || !dentId || !rendezVousId) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    const soin = await prisma.soin.findUnique({ where: { code: soinId } });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }
    const dent = await prisma.dent.findUnique({ where: { code: dentId } });
    if (!dent) {
      return res.status(404).json({
        success: false,
        error: "Dent not found",
      });
    }
    const rendezVous = await prisma.rendezVous.findUnique({
      where: { id: rendezVousId },
    });
    if (!rendezVous) {
      return res.status(404).json({
        success: false,
        error: "Rendez-vous not found",
      });
    }

    const newSoinEffectue = await prisma.soinEffectue.create({
      data: {
        date: formatedDate,
        commentaire,
        soin: { connect: { code: soinId } },
        dent: { connect: { code: dentId } },
        rendezVous: { connect: { id: rendezVousId } },
        facture: factureId ? { connect: { id: factureId } } : undefined,
      },
    });
    res.status(201).json({
      success: true,
      message: "SoinEffectue created successfully",
      soinEffectue: newSoinEffectue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins-effectues:
 *   get:
 *     summary: Get all soins effectues
 *     tags: [SoinsEffectues]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *     responses:
 *       200:
 *         description: SoinsEffectues fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function getAllSoinsEffectues(req, res) {
  try {
    const soinsEffectues = await prisma.soinEffectue.findMany({
      include: {
        soin: true,
        dent: true,
        rendezVous: true,
        facture: true,
      },
    });
    res.status(200).json({
      success: true,
      data: soinsEffectues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins-effectues/{id}:
 *   get:
 *     summary: Get a soin effectue by id
 *     tags: [SoinsEffectues]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin effectue
 *     responses:
 *       200:
 *         description: SoinEffectue fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function getSoinEffectueById(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }
    const soinEffectue = await prisma.soinEffectue.findUnique({
      where: { id },
      include: {
        soin: true,
        dent: true,
        rendezVous: true,
        facture: true,
      },
    });
    if (!soinEffectue) {
      return res.status(404).json({
        success: false,
        error: "SoinEffectue not found",
      });
    }
    res.status(200).json({
      success: true,
      data: soinEffectue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins-effectues/{id}:
 *   put:
 *     summary: Update a soin effectue
 *     tags: [SoinsEffectues]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin effectue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: The date of the soin
 *               commentaire:
 *                 type: string
 *                 description: The commentaire of the soin
 *               soinId:
 *                 type: string
 *                 description: The id of the soin
 *               dentId:
 *                 type: string
 *                 description: The id of the dent
 *               rendezVousId:
 *                 type: string
 *                 description: The id of the rendez-vous
 *               factureId:
 *                 type: string
 *                 description: The id of the facture
 *     responses:
 *       200:
 *         description: SoinEffectue updated successfully
 *       500:
 *         description: Bad Request
 *
 */
async function updateSoinEffectue(req, res) {
  const { id } = req.params;
  const { date, commentaire, soinId, dentId, rendezVousId, factureId } =
    req.body;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }
    const dataToUpdate = {};
    if (date) {
      dataToUpdate.date = formatDate(date);
      if (!validator.isDate(date, { format: "YYYY-MM-DD" })) {
        return res.status(400).json({
          success: false,
          error: "Invalid date, format must be yyyy-mm-dd",
        });
      }
    }
    if (commentaire) dataToUpdate.commentaire = commentaire;

    if (soinId) {
      const soin = await prisma.soin.findUnique({ where: { code: soinId } });
      if (!soin) {
        return res.status(404).json({
          success: false,
          error: "Soin not found",
        });
      }
      dataToUpdate.soin = { connect: { code: soinId } };
    }
    if (dentId) {
      const dent = await prisma.dent.findUnique({ where: { code: dentId } });
      if (!dent) {
        return res.status(404).json({
          success: false,
          error: "Dent not found",
        });
      }
      dataToUpdate.dent = { connect: { code: dentId } };
    }
    if (rendezVousId) {
      const rendezVous = await prisma.rendezVous.findUnique({
        where: { id: rendezVousId },
      });
      if (!rendezVous) {
        return res.status(404).json({
          success: false,
          error: "Rendez-vous not found",
        });
      }
      dataToUpdate.rendezVous = { connect: { id: rendezVousId } };
    }
    if (factureId) {
      const facture = await prisma.facture.findUnique({
        where: { id: factureId },
      });
      if (!facture) {
        return res.status(404).json({
          success: false,
          error: "Facture not found",
        });
      }
      dataToUpdate.facture = { connect: { id: factureId } };
    }
    const updatedSoinEffectue = await prisma.soinEffectue.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json({
      success: true,
      message: "SoinEffectue updated successfully",
      data: updatedSoinEffectue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins-effectues/{id}:
 *   delete:
 *     summary: Delete a soin effectue
 *     tags: [SoinsEffectues]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: id
 *         type: string
 *         description: The id of the soin effectue
 *     responses:
 *       204:
 *         description: SoinEffectue deleted successfully
 *       500:
 *         description: Bad Request
 *
 */
async function deleteSoinEffectue(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Id is required",
      });
    }

    await prisma.soinEffectue.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "SoinEffectue deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 *
 * @swagger
 * /api/v1/soins-effectues/rendez-vous/{rendezVousId}:
 *   get:
 *     summary: Get soins effectues by rendez-vous id
 *     tags: [SoinsEffectues]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         description: The access token for authentication
 *       - in: path
 *         name: rendezVousId
 *         type: string
 *         description: The id of the rendez-vous
 *     responses:
 *       200:
 *         description: SoinsEffectues fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function getSoinsEffectuesByRendezVous(req, res) {
  const { rendezVousId } = req.params;
  try {
    if (!rendezVousId) {
      return res.status(400).json({
        success: false,
        error: "Rendez-vous id is required",
      });
    }
    const rendezVous = await prisma.rendezVous.findUnique({
      where: { id: rendezVousId },
    });
    if (!rendezVous) {
      return res.status(404).json({
        success: false,
        error: "Rendez-vous not found",
      });
    }
    const soinsEffectues = await prisma.soinEffectue.findMany({
      where: { rendezVousId },
      include: {
        soin: true,
        dent: true,
        rendezVous: { include: { patient: true } },
        facture: true,
      },
    });
    res.status(200).json({
      success: true,
      data: soinsEffectues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

module.exports = {
  createSoinEffectue,
  getAllSoinsEffectues,
  getSoinEffectueById,
  updateSoinEffectue,
  deleteSoinEffectue,
  getSoinsEffectuesByRendezVous,
};
