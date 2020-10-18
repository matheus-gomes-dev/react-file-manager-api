const { get, reduce, set, snakeCase } = require('lodash');
const UploadsModel = require('../models/Uploads');
const UploadedDataModel = require('../models/UploadedData');
const utils = require('../utils');

module.exports = {
  read: async (req, res) => {
    const page = Number(get(req, 'query.page', 1));
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
      const results = await UploadsModel.findAndCountAll({
        limit,
        offset
      });
      return res.status(200).send(results);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to read uploads' });
    }
  },
  readById: async (req, res) => {
    const id = get(req, 'params.id');
    try {
      const result = await UploadsModel.findByPk(id, {
        include: { association: 'uploaded_data' }
      });
      if (!result) res.status(400).send({ message: 'Upload not found' });
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to read upload by id' });
    }
  },
  create: async (req, res) => {
    const { fileName: name } = req.body;
    const file = req.file;
    if (!file) return res.status(400).send({ message: 'No file provided' });
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