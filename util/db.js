const { Sequelize } = require('sequelize')

const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log('Connected to database')
  } catch (error) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }
  return null
}

module.exports = {
  connectToDatabase, sequelize
}