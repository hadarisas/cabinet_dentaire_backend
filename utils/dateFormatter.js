function formatDate(date) {
  return new Date(date).toISOString();
}

function formatDateToDDMMYYYY(date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

module.exports = { formatDate, formatDateToDDMMYYYY };
