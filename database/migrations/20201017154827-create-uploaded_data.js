'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('uploaded_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      upload_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      yard_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      employee_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clock_in: {
        type: Sequelize.DATE,
        allowNull: false
      },
      clock_out: {
        type: Sequelize.DATE,
        allowNull: false
      },
      file_row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('uploaded_data');
  }
};
