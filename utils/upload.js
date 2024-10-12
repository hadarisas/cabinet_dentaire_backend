const multer = require("multer");
const path = require("path");
const fs = require("fs");

async function uploadFile(file, patientId) {
  try {
    const uploadDir = path.join(__dirname, "../public/uploads", patientId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${patientId}.${file.originalname
      .split(".")
      .pop()}`;

    const filePath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    const databasePath = path.join("/uploads", patientId, fileName);

    return {
      success: true,
      filePath: databasePath,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  uploadFile,
};
