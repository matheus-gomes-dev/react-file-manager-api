const UploadsModel = require('../models/Uploads');
const utils = require('../utils');

module.exports = {
  async create(req, res) {
    const { fileName: name } = req.body;
    const file = req.file;
    try {
      const parsedFile = await utils.parseCSVFile(file.path);
      console.log(parsedFile);
      const upload = await UploadsModel.create({ name });
      return res.status(200).send(upload);
    } catch(error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to create upload record' });
    }
  }
};