const { Model, DataTypes } = require('sequelize');

class Uploads extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = Uploads;