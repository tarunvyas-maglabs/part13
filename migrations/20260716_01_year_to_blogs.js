const { DataTypes } = require("sequelize")

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'date', {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'date')
  }
}