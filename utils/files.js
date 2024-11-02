const multer = require("multer");
const path = require("path");
const fs = require("fs");

async function uploadFile(file, patientId) {
  try {
    const uploadDir = path.join(__dirname, "../public/uploads", patientId);
    console.log(`uploadDir: ${uploadDir}`);
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

async function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../", filePath);
    await fs.promises.unlink(fullPath);
    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("File deletion failed:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

async function uploadProfilePicture(file, userId) {
  try {
    const uploadDir = path.join(__dirname, "../public/uploads/profile");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${userId}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Write the file
    await fs.promises.writeFile(filePath, file.buffer);

    return {
      success: true,
      filePath: `/public/uploads/profile/${fileName}`,
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
  deleteFile,
  uploadProfilePicture,
};
