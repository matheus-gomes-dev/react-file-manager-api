const UploadsModel = require('../models/Uploads');

module.exports = {
  async create(req, res) {
    const { name } = req.body;
    try {
      const upload = await UploadsModel.create({ name });
      return res.status(200).send(upload);
    } catch(error) {
      console.log(error);
      return res.status(500).send({ message: 'Failed to create upload record' });
    }
  }
};