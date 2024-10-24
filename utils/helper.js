const prisma = require("../config/prisma");

const calculateTotalAmount = (factureSoins) => {
  // Check if factureSoins is defined and is an array
  if (!Array.isArray(factureSoins)) {
    return 0; // Return 0 if factureSoins is not provided or not an array
  }

  // Calculate the total amount using reduce
  return factureSoins.reduce((total, item) => {
    // Ensure item.montant is a number before adding
    return total + (item.montant || 0);
  }, 0);
};

// Helper function to generate Facture number
const generateInvoiceNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // Get count of Factures for this month
  const count = await prisma.facture.count({
    where: {
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1),
        lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      },
    },
  });

  return `INV-${year}${month}-${String(count + 1).padStart(4, "0")}`;
};

module.exports = {
  calculateTotalAmount,
  generateInvoiceNumber,
};
