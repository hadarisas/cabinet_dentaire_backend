const prisma = require("../config/prisma");

const { formatDate, formatDateAndTime } = require("../utils/dateFormatter");
const validator = require("validator");

/**
 * @swagger
 * tags:
 *   name: Rendez-vous
 *   description: API endpoints for Rendez-vous management
 *
 * /api/v1/rendez-vous:
 *   post:
 *     summary: Add a rendez-vous
 *     description: Add a new rendez-vous
 *     tags: [Rendez-vous]
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
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               duree:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               patientId:
 *                 type: string
 *               salleConsultationId:
 *                 type: string
 *               utilisateurId:
 *                 type: string
 *               motif:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rendez-vous added successfully
 *       500:
 *         description: Internal server error
 */

async function addAppointment(req, res) {
  const {
    date,
    time,
    duree,
    patientId,
    salleConsultationId,
    utilisateurId,
    motif,
    notes,
  } = req.body;
  if (
    !date ||
    !duree ||
    !time ||
    !patientId ||
    !salleConsultationId ||
    !utilisateurId ||
    !motif ||
    !notes
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isDate(date, { format: "YYYY-MM-DD" })) {
    return res
      .status(400)
      .json({ message: "Invalid date, format must be yyyy-mm-dd" });
  }

  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) {
    return res
      .status(400)
      .json({ message: "Invalid time, format must be hh:mm" });
  }
  const dateAndTime = formatDateAndTime(date, time);

  if (dateAndTime < new Date().toISOString()) {
    return res.status(400).json({ message: "Date cannot be in the past" });
  }
  const endDate = new Date(dateAndTime);
  endDate.setMinutes(endDate.getMinutes() + duree);
  //the start and end date format ex: 2024-01-01T11:00:00.000Z

  try {
    // Check for conflicting appointments
    const conflictingAppointments = await prisma.rendezVous.findMany({
      where: {
        utilisateurId,
        OR: [
          {
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gt: dateAndTime } },
            ],
          },
          {
            startDate: dateAndTime,
          },
          {
            endDate: endDate,
          },
        ],
      },
    });

    if (conflictingAppointments.length > 0) {
      return res.status(400).json({
        message:
          "The dentist has a conflicting appointment during this time slot",
      });
    }

    await prisma.rendezVous.create({
      data: {
        startDate: dateAndTime,
        endDate,
        patientId,
        salleConsultationId,
        utilisateurId,
        motif,
        notes,
        status: "confirmed",
      },
    });
    return res
      .status(200)
      .json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/{id}:
 *   put:
 *     summary: Update a rendez-vous
 *     description: Update an existing rendez-vous by ID
 *     tags: [Rendez-vous]
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
 *         description: The ID of the rendez-vous to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               duree:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *               patientId:
 *                 type: string
 *               salleConsultationId:
 *                 type: string
 *               utilisateurId:
 *                 type: string
 *               motif:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rendez-vous updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function updateAppointment(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  try {
    const existingAppointment = await prisma.rendezVous.findUnique({
      where: { id },
    });
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const dataToUpdate = {};
    let newStartDate, newEndDate;
    if (req.body.date && req.body.time) {
      if (!validator.isDate(req.body.date, { format: "YYYY-MM-DD" })) {
        return res
          .status(400)
          .json({ message: "Invalid date, format must be yyyy-mm-dd" });
      }
      const [hours, minutes] = req.body.time.split(":");
      if (!hours || !minutes) {
        return res
          .status(400)
          .json({ message: "Invalid time, format must be hh:mm" });
      }
      newStartDate = formatDateAndTime(req.body.date, req.body.time);
      dataToUpdate.startDate = newStartDate;
    } else {
      newStartDate = existingAppointment.startDate;
    }

    if (req.body.duree) {
      newEndDate = new Date(newStartDate);
      newEndDate.setMinutes(newEndDate.getMinutes() + parseInt(req.body.duree));
    } else {
      newEndDate = existingAppointment.endDate;
    }
    dataToUpdate.endDate = newEndDate;

    if (req.body.patientId) dataToUpdate.patientId = req.body.patientId;
    if (req.body.salleConsultationId)
      dataToUpdate.salleConsultationId = req.body.salleConsultationId;
    if (req.body.utilisateurId)
      dataToUpdate.utilisateurId = req.body.utilisateurId;

    if (req.body.motif) dataToUpdate.motif = req.body.motif;
    if (req.body.notes) dataToUpdate.notes = req.body.notes;

    // Check for conflicting appointments
    const conflictingAppointments = await prisma.rendezVous.findMany({
      where: {
        id: { not: id },
        utilisateurId:
          dataToUpdate.utilisateurId || existingAppointment.utilisateurId,
        OR: [
          {
            AND: [
              { startDate: { lt: newEndDate } },
              { endDate: { gt: newStartDate } },
            ],
          },
          {
            startDate: newStartDate,
          },
          {
            endDate: newEndDate,
          },
        ],
      },
    });

    if (conflictingAppointments.length > 0) {
      return res.status(400).json({
        message:
          "The dentist has a conflicting appointment during this time slot",
      });
    }

    await prisma.rendezVous.update({ where: { id }, data: dataToUpdate });
    return res
      .status(200)
      .json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/{id}:
 *   delete:
 *     summary: Delete a rendez-vous
 *     description: Delete an existing rendez-vous by ID
 *     tags: [Rendez-vous]
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
 *         description: The ID of the rendez-vous to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function cancelAppointment(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  try {
    const existingAppointment = await prisma.rendezVous.findUnique({
      where: { id },
    });
    if (!existingAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await prisma.rendezVous.update({
      where: { id },
      data: { status: "canceled" },
    });
    return res.status(200).json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/patient/{id}:
 *   get:
 *     summary: Get rendez-vous by patient ID
 *     description: Retrieve rendez-vous by patient ID
 *     tags: [Rendez-vous]
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
 *         description: The ID of the patient to retrieve rendez-vous for
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of rendez-vous to retrieve per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Rendez-vous retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function getAppointmentsByPatientId(req, res) {
  const { patientId } = req.params;
  const { size = 10, page = 1 } = req.query;
  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }
  //include the Dentist name in the response

  try {
    const appointments = await prisma.rendezVous.findMany({
      where: { patientId, status: "confirmed" },
      orderBy: { startDate: "desc" },
      skip: (page - 1) * size,
      take: Number(size) * 1,
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        salleConsultation: {
          select: {
            numero: true,
          },
        },
      },
    });
    const response = appointments.map((appointment) => ({
      id: appointment.id,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      patientName: `${appointment.patient.nom} ${appointment.patient.prenom}`,
      salleConsultationId: appointment.salleConsultationId,
      salleConsultationNumero: appointment.salleConsultation.numero,
      dentistId: appointment.utilisateurId,
      dentistName: `${appointment.utilisateur.nom} ${appointment.utilisateur.prenom}`,
      motif: appointment.motif,
      notes: appointment.notes,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/user/{id}:
 *   get:
 *     summary: Get rendez-vous by user ID
 *     description: Retrieve rendez-vous by user ID
 *     tags: [Rendez-vous]
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
 *         description: The ID of the user to retrieve rendez-vous for
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of rendez-vous to retrieve per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Rendez-vous retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function getAppoitmentsByUserId(req, res) {
  const { userId } = req.params;
  const { size = 10, page = 1 } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const appointments = await prisma.rendezVous.findMany({
      orderBy: { startDate: "desc" },
      where: { utilisateurId: userId, status: "confirmed" },
      skip: (page - 1) * size,
      take: Number(size) * 1,
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        salleConsultation: {
          select: {
            numero: true,
          },
        },
      },
    });
    const response = appointments.map((appointment) => ({
      id: appointment.id,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      patientName: `${appointment.patient.nom} ${appointment.patient.prenom}`,
      salleConsultationId: appointment.salleConsultationId,
      salleConsultationNumero: appointment.salleConsultation.numero,
      dentistId: appointment.utilisateurId,
      dentistName: `${appointment.utilisateur.nom} ${appointment.utilisateur.prenom}`,
      motif: appointment.motif,
      notes: appointment.notes,
    }));
    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/{id}:
 *   get:
 *     summary: Get rendez-vous by ID
 *     description: Retrieve rendez-vous by ID
 *     tags: [Rendez-vous]
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
 *         description: The ID of the rendez-vous to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendez-vous retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function getAppointmentById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  try {
    const appointment = await prisma.rendezVous.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        salleConsultation: {
          select: {
            numero: true,
          },
        },
      },
    });
    const response = {
      id: appointment.id,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      patientName: `${appointment.patient.nom} ${appointment.patient.prenom}`,
      salleConsultationId: appointment.salleConsultationId,
      salleConsultationNumero: appointment.salleConsultation.numero,
      dentistId: appointment.utilisateurId,
      dentistName: `${appointment.utilisateur.nom} ${appointment.utilisateur.prenom}`,
      motif: appointment.motif,
      notes: appointment.notes,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous:
 *   get:
 *     summary: Get all rendez-vous
 *     description: Retrieve all rendez-vous
 *     tags: [Rendez-vous]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of rendez-vous to retrieve per page
 *         schema:
 *           type: number
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: number
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Rendez-vous retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function getAllAppointments(req, res) {
  const { size = 10, page = 1 } = req.query;
  try {
    //order by startDate
    const appointments = await prisma.rendezVous.findMany({
      orderBy: { startDate: "desc" },
      skip: (page - 1) * size,
      take: Number(size),
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        salleConsultation: {
          select: {
            numero: true,
          },
        },
      },
    });
    const response = appointments.map((appointment) => ({
      id: appointment.id,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      patientName: `${appointment.patient.nom} ${appointment.patient.prenom}`,
      salleConsultationId: appointment.salleConsultationId,
      salleConsultationNumero: appointment.salleConsultation.numero,
      dentistId: appointment.utilisateurId,
      dentistName: `${appointment.utilisateur.nom} ${appointment.utilisateur.prenom}`,
      motif: appointment.motif,
      notes: appointment.notes,
    }));
    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @swagger
 * /api/v1/rendez-vous/active:
 *   get:
 *     summary: Get all active rendez-vous
 *     description: Retrieve all active rendez-vous
 *     tags: [Rendez-vous]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         required: false
 *         description: Number of rendez-vous to retrieve per page
 *         schema:
 *           type: number
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number to retrieve
 *         schema:
 *           type: number
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Rendez-vous retrieved successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rendez-vous not found
 *       500:
 *         description: Internal server error
 */
async function getAllActiveAppointments(req, res) {
  const { size = 10, page = 1 } = req.query;
  try {
    const appointments = await prisma.rendezVous.findMany({
      where: { status: "confirmed" },
      skip: (page - 1) * size,
      take: Number(size),
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
          },
        },
        salleConsultation: {
          select: {
            numero: true,
          },
        },
      },
    });
    const response = appointments.map((appointment) => ({
      id: appointment.id,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      patientId: appointment.patientId,
      patientName: `${appointment.patient.nom} ${appointment.patient.prenom}`,
      salleConsultationId: appointment.salleConsultationId,
      salleConsultationNumero: appointment.salleConsultation.numero,
      dentistId: appointment.utilisateurId,
      dentistName: `${appointment.utilisateur.nom} ${appointment.utilisateur.prenom}`,
      motif: appointment.motif,
      notes: appointment.notes,
    }));
    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPatientId,
  getAppointmentById,
  getAppoitmentsByUserId,
  getAllAppointments,
  getAllActiveAppointments,
};
