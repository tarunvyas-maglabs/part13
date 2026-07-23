const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./reading_lists')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'users_marked' })

Session.belongsTo(User)
User.hasMany(Session)

module.exports = {
  Blog,
  User,
  ReadingLists,
  Session
}