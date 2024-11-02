const prisma = require("../config/prisma");
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API endpoints for Roles management
 *
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         description: The access token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       500:
 *         description: Bad Request
 *
 */
async function getRoles(req, res) {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json({
      success: true,
      data: roles,
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
  getRoles,
};
