const { Model, DataTypes } = require('sequelize');

class Uploads extends Model {

  static init(sequelize) {
    super.init({
      name: DataTypes.STRING
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.UploadedData, { foreignKey: 'upload_id', as: 'uploaded_data' });
  }
}

module.exports = Uploads;