const fs = require("fs").promises;

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("File deleted successfully.");
  } catch (e) {
    console.log("Error deleting file:", e.message);
  }
};

module.exports = {
  deleteFile,
};
