const { reduce, set, snakeCase } = require('lodash');
const UploadsModel = require('../models/Uploads');
const UploadedDataModel = require('../models/UploadedData');
const utils = require('../utils');

module.exports = {
  async create(req, res) {
    const { fileName: name } = req.body;
    const file = req.file;
    try {
      const parsedFile = await utils.parseCSVFile(file.path);
      const result = await UploadsModel.create({ name });
      const upload_id = result.id;
      const records = parsedFile.map((row, index) => {
        const record = reduce(row, (acc, value, key) => {
          set(acc, snakeCase(key), value);
          return acc;
        }, {});
        set(record, 'upload_id', upload_id);
        set(record, 'file_row', index);
        return record;
      });
      await UploadedDataModel.bulkCreate(records);
      return res.status(200).send(result);
    } catch(error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to store upload' });
    }
  }
};