function formatDate(date) {
  return new Date(date).toISOString();
}

function formatDateAndTime(date, time) {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const formattedDate = new Date(
    Date.UTC(year, month - 1, day, hours, minutes)
  );
  return formattedDate.toISOString();
}

function formatDateToDDMMYYYY(date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

module.exports = { formatDate, formatDateToDDMMYYYY, formatDateAndTime };
