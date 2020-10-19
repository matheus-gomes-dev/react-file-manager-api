const multer = require('multer');
const uploadFiles = multer({ dest: 'tmp' });

module.exports = {
  uploads: uploadFiles.single('file')
}