const fs = require('fs');
const path = require('path');

exports.deletefiles = (relativePath) => {
  if (!relativePath) return;

  const absolutePath = path.join(__dirname, '..', relativePath); // Adjust relative path

  if (fs.existsSync(absolutePath)) {
    fs.unlink(absolutePath, (err) => {
      if (err) {
        return console.error('Error deleting file:', err.message);
      }
      console.log('✅ Deleted file:', absolutePath);
    });
  } else {
    console.warn('⚠️ File not found at:', absolutePath);
  }
};
