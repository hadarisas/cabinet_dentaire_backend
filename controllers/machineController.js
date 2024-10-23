const prisma = require("../config/prisma");
const { formatDate } = require("../utils/dateFormatter");
const validator = require("validator");

/**
 * @swagger
 * /api/v1/machines:
 *   post:
 *     summary: Add a machine
 *     description: Add a new machine
 *     tags: [Machines]
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
 *               modele:
 *                 type: string
 *               dateAchat:
 *                 type: string
 *                 format: date
 *                 example: 2021-01-01
 *               dateDerniereRevision:
 *                 type: string
 *                 format: date
 *                 example: 2021-01-01
 *     responses:
 *       200:
 *         description: Machine added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 */

async function addMachine(req, res) {
  const { nom, modele, dateAchat, dateDerniereRevision } = req.body;
  try {
    if (!nom || !modele || !dateAchat || !dateDerniereRevision) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    if (
      !validator.isDate(dateAchat, { format: "YYYY-MM-DD" }) ||
      !validator.isDate(dateDerniereRevision, { format: "YYYY-MM-DD" })
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }
    const formattedDateAchat = formatDate(dateAchat);
    const formattedDateDerniereRevision = formatDate(dateDerniereRevision);

    await prisma.machine.create({
      data: {
        nom,
        modele,
        dateAchat: formattedDateAchat,
        dateDerniereRevision: formattedDateDerniereRevision,
      },
    });
    res.status(200).json({
      success: true,
      message: "Machine added successfully",
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
 * /api/v1/machines:
 *   get:
 *     summary: Get all machines
 *     description: Get all machines from the database
 *     tags: [Machines]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machines fetched successfully
 *       500:
 *         description: Bad Request
 */
async function getMachines(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const machines = await prisma.machine.findMany({
      skip: (page - 1) * limit,
      take: Number(limit) * 1,
    });
    res.status(200).json({
      success: true,
      data: machines,
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
 * /api/v1/machines/{id}:
 *   get:
 *     summary: Get a machine by ID
 *     description: Get a machine from the database by ID
 *     tags: [Machines]
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
 *         description: ID of the machine to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machine fetched successfully
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Bad Request
 */
async function getMachineById(req, res) {
  const { id } = req.params;
  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      include: { salles: true },
    });
    if (!machine) {
      return res.status(404).json({
        success: false,
        error: "Machine not found",
      });
    }
    res.status(200).json({
      success: true,
      data: machine,
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
 * /api/v1/machines/{id}:
 *   put:
 *     summary: Update a ma chine by ID
 *     description: Update a machine in the database by ID
 *     tags: [Machines]
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
 *         description: ID of the machine to update
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
 *               modele:
 *                 type: string
 *               dateAchat:
 *                 type: string
 *                 format: date
 *                 example: 2021-01-01
 *               dateDerniereRevision:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-20
 *
 *     responses:
 *       200:
 *         description: Machine updated successfully
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Bad Request
 */

async function updateMachine(req, res) {
  const { id } = req.params;
  const { nom, modele, dateAchat, dateDerniereRevision } = req.body;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Machine ID is required",
      });
    }
    const dataToUpdate = {};
    if (dateAchat && !validator.isDate(dateAchat, { format: "YYYY-MM-DD" })) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }
    if (
      dateDerniereRevision &&
      !validator.isDate(dateDerniereRevision, { format: "YYYY-MM-DD" })
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid date, format must be yyyy-mm-dd",
      });
    }
    const existingMachine = await prisma.machine.findUnique({
      where: { id },
    });
    if (!existingMachine) {
      return res.status(404).json({
        success: false,
        error: "Machine not found",
      });
    }

    if (nom) dataToUpdate.nom = nom;
    if (modele) dataToUpdate.modele = modele;
    if (dateAchat) {
      const formattedDateAchat = formatDate(dateAchat);
      dataToUpdate.dateAchat = formattedDateAchat;
    }
    if (dateDerniereRevision) {
      const formattedDateDerniereRevision = formatDate(dateDerniereRevision);
      dataToUpdate.dateDerniereRevision = formattedDateDerniereRevision;
    }
    await prisma.machine.update({
      where: { id },
      data: dataToUpdate,
    });
    res.status(200).json({
      success: true,
      message: "Machine updated successfully",
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
 * /api/v1/machines/{id}:
 *   delete:
 *     summary: Delete a machine by ID
 *     description: Delete a machine from the database by ID
 *     tags: [Machines]
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
 *         description: ID of the machine to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machine deleted successfully
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Bad Request
 */
async function deleteMachine(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Machine ID is required",
      });
    }
    const existingMachine = await prisma.machine.findUnique({
      where: { id },
    });
    if (!existingMachine) {
      return res.status(404).json({
        success: false,
        error: "Machine not found",
      });
    }
    await prisma.machine.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Machine deleted successfully",
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
 *
 * @swagger
 * /api/v1/machines/assign-to-salle:
 *   post:
 *     summary: Assign a machine to a Consultation Room
 *     description: Assigne a machine to a Consultation Room
 *     tags: [Machines]
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
 *               machineId:
 *                 type: string
 *               salleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine assigned to salle successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Bad Request
 */

async function assignMachineToSalle(req, res) {
  const { machineId, salleId } = req.body;
  if (!machineId || !salleId) {
    return res.status(400).json({
      success: false,
      error: "Machine ID and salle ID are required",
    });
  }
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
    });
    const salle = await prisma.salleConsultation.findUnique({
      where: { id: salleId },
    });
    if (!machine) {
      return res.status(404).json({
        success: false,
        error: "Machine not found",
      });
    }
    if (!salle) {
      return res.status(404).json({
        success: false,
        error: "Salle not found",
      });
    }
    console.log(`machineId: ${machineId}, salleId: ${salleId}`);
    await prisma.machine_SalleConsultation.create({
      data: {
        machine: { connect: { id: machineId } },
        salleConsultation: { connect: { id: salleId } },
      },
    });
    res.status(200).json({
      success: true,
      message: "Machine assigned to salle successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      error: "Bad Request",
    });
  }
}

module.exports = {
  addMachine,
  getMachines,
  updateMachine,
  deleteMachine,
  getMachineById,
  assignMachineToSalle,
};
