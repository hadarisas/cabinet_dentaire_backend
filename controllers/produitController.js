const prisma = require("../config/prisma");

/**
 * @swagger
 * tags:
 *   name: Produits
 *   description: API endpoints for Produits management
 *
 * /api/v1/produits:
 *   post:
 *     summary: Add a new produit
 *     description: Add a new produit to the database
 *     tags: [Produits]
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
 *                 description: Name of the produit
 *               quantite:
 *                 type: number
 *                 description: Quantity of the produit
 *               seuil:
 *                 type: number
 *                 description: Threshold for the produit
 *               fournisseur:
 *                 type: string
 *                 description: Supplier of the produit
 *               prixUnitaire:
 *                 type: number
 *                 description: Unit price of the produit
 *     responses:
 *       201:
 *         description: Produit added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 */
async function addProduit(req, res) {
  const { nom, quantite, seuil, fournisseur, prixUnitaire } = req.body;

  if (!nom || !quantite || !seuil || !fournisseur || !prixUnitaire) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }
  if (typeof quantite !== "number" || quantite <= 0) {
    return res.status(400).json({
      success: false,
      error: "Quantity must be a positive number",
    });
  }
  if (typeof seuil !== "number" || seuil <= 0) {
    return res.status(400).json({
      success: false,
      error: "Seuil must be a positive number",
    });
  }
  if (typeof prixUnitaire !== "number" || prixUnitaire <= 0) {
    return res.status(400).json({
      success: false,
      error: "Price must be a positive number",
    });
  }

  try {
    await prisma.produitConsommable.create({ data: req.body });
    return res.status(200).json({
      success: true,
      message: "Produit added successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * /api/v1/produits/{id}:
 *   put:
 *     summary: Update a produit by ID
 *     description: Update a produit by providing its ID and the updated data.
 *     tags: [Produits]
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
 *         description: ID of the produit to update
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
 *                 description: Updated name of the produit
 *               quantite:
 *                 type: number
 *                 description: Updated quantity of the produit
 *               seuil:
 *                 type: number
 *                 description: Updated seuil of the produit
 *               fournisseur:
 *                 type: string
 *                 description: Updated supplier of the produit
 *               prixUnitaire:
 *                 type: number
 *                 description: Updated unit price of the produit
 *     responses:
 *       200:
 *         description: Produit updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Produit not found
 *       500:
 *         description: Bad Request
 */
async function updateProduit(req, res) {
  const { id } = req.params;
  const { nom, quantite, seuil, fournisseur, prixUnitaire } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "ID is required",
    });
  }
  const dataToUpdate = {};

  if (nom) dataToUpdate.nom = nom;
  if (quantite) {
    if (typeof quantite !== "number" || quantite <= 0) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a positive number",
      });
    } else {
      dataToUpdate.quantite = quantite;
    }
  }
  if (seuil) {
    if (typeof seuil !== "number" || seuil <= 0) {
      return res.status(400).json({
        success: false,
        error: "Seuil must be a positive number",
      });
    } else {
      dataToUpdate.seuil = seuil;
    }
  }
  if (fournisseur) dataToUpdate.fournisseur = fournisseur;
  if (prixUnitaire) {
    if (typeof prixUnitaire !== "number" || prixUnitaire <= 0) {
      return res.status(400).json({
        success: false,
        error: "Price must be a positive number",
      });
    } else {
      dataToUpdate.prixUnitaire = prixUnitaire;
    }
  }

  try {
    const produit = await prisma.produitConsommable.findUnique({
      where: { id },
    });
    if (!produit) {
      return res.status(404).json({
        success: false,
        error: "Produit not found",
      });
    }
    await prisma.produitConsommable.update({
      where: { id },
      data: dataToUpdate,
    });
    return res.status(200).json({
      success: true,
      message: "Produit updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * /api/v1/produits/{id}:
 *   delete:
 *     summary: Delete a produit by ID
 *     description: Delete a produit by providing its ID.
 *     tags: [Produits]
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
 *         description: ID of the produit to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Produit not found
 *       500:
 *         description: Bad Request
 */
async function deleteProduit(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "ID is required",
    });
  }
  try {
    const produit = await prisma.produitConsommable.findUnique({
      where: { id },
    });
    if (!produit) {
      return res.status(404).json({
        success: false,
        error: "Produit not found",
      });
    }

    await prisma.produitConsommable.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "Produit deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * /api/v1/produits:
 *   get:
 *     summary: Get all produits
 *     description: Retrieve a list of all produits.
 *     tags: [Produits]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProduitConsommable'
 *       500:
 *         description: Bad Request
 */
async function getAllProduits(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const produits = await prisma.produitConsommable.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });
    return res.status(200).json({
      success: true,
      data: produits,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * /api/v1/produits/{id}:
 *   get:
 *     summary: Get a produit by ID
 *     description: Retrieve a produit by providing its ID.
 *     tags: [Produits]
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
 *         description: ID of the produit to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProduitConsommable'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Produit not found
 *       500:
 *         description: Bad Request
 */
async function getProduitById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: "ID is required",
    });
  }
  try {
    const produit = await prisma.produitConsommable.findUnique({
      where: { id },
    });
    return res.status(200).json({
      success: true,
      data: produit,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

/**
 * @swagger
 * /api/v1/produits/assign-to-treatment:
 *   post:
 *     summary: Assign a produit to a treatment
 *     description: Assign a produit to a treatment by providing the produit ID and the treatment ID.
 *     tags:
 *       - Produits
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
 *               produitId:
 *                 type: string
 *                 description: ID of the produit to assign.
 *               soinId:
 *                 type: string
 *                 description: ID of the soin to assign the produit to.
 *               quantite:
 *                 type: number
 *                 description: Quantity of the produit to assign.
 *     responses:
 *       200:
 *         description: Produit assigned to soin successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Produit or soin not found
 *       500:
 *         description: Bad Request
 */

async function assignToTreatment(req, res) {
  const { produitId, soinId, quantite } = req.body;
  if (!produitId || !soinId || !quantite) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }
  if (typeof quantite !== "number" || quantite <= 0) {
    return res.status(400).json({
      success: false,
      error: "Quantity must be a positive number",
    });
  }
  try {
    const produit = await prisma.produitConsommable.findUnique({
      where: { id: produitId },
    });
    if (!produit) {
      return res.status(404).json({
        success: false,
        error: "Produit not found",
      });
    }
    await prisma.produitConsommable.update({
      where: { id: produitId },
      data: { quantite: { decrement: quantite } },
    });
    const soin = await prisma.soin.findUnique({
      where: { code: soinId },
    });
    if (!soin) {
      return res.status(404).json({
        success: false,
        error: "Soin not found",
      });
    }
    await prisma.produitConsommable_Soin.create({
      data: {
        produitConsommable: { connect: { id: produitId } },
        soin: { connect: { code: soinId } },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Produit assigned to soin successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}
/**
 * @swagger
 * /api/v1/produits/remove-from-treatment:
 *   post:
 *     summary: Remove a produit from a treatment
 *     description: Remove a produit from a treatment by providing the produit ID and the treatment ID.
 *     tags:
 *       - Produits
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
 *               produitId:
 *                 type: string
 *                 description: ID of the produit to remove.
 *               soinId:
 *                 type: string
 *                 description: ID of the soin to remove the produit from.
 *               quantite:
 *                 type: number
 *                 description: Quantity of the produit to remove.
 *     responses:
 *       200:
 *         description: Produit removed from soin successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Produit or soin not found
 *       500:
 *         description: Bad Request
 */
async function removeFromTreatment(req, res) {
  const { produitId, soinId, quantite } = req.body;
  if (!produitId || !soinId || !quantite) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }
  if (typeof quantite !== "number" || quantite <= 0) {
    return res.status(400).json({
      success: false,
      error: "Quantity must be a positive number",
    });
  }
  try {
    const produitSoin = await prisma.produitConsommable_Soin.findUnique({
      where: {
        produitConsommableId_soinId: {
          produitConsommableId: produitId,
          soinId: soinId,
        },
      },
    });
    if (!produitSoin) {
      return res.status(404).json({
        success: false,
        error: "Association not found",
      });
    }
    await prisma.produitConsommable.update({
      where: { id: produitId },
      data: { quantite: { increment: quantite } },
    });
    await prisma.produitConsommable_Soin.delete({
      where: {
        produitConsommableId_soinId: {
          produitConsommableId: produitId,
          soinId: soinId,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Produit removed from soin successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

module.exports = {
  addProduit,
  updateProduit,
  deleteProduit,
  getAllProduits,
  getProduitById,
  assignToTreatment,
  removeFromTreatment,
};
