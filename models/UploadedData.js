const { Model, DataTypes } = require('sequelize');

class UploadedData extends Model {
  static init(sequelize) {
    super.init({
      upload_id: DataTypes.INTEGER,
      yard_code: DataTypes.STRING,
      employee_code: DataTypes.STRING,
      clock_in: DataTypes.STRING,
      clock_out: DataTypes.STRING,
      file_row: DataTypes.INTEGER
    }, {
      sequelize
    });
  }
}

module.exports = UploadedData;