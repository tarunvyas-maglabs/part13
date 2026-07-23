const router = require('express').Router()
const { User, Blog, Session, ReadingLists } = require('../models')

router.post('/', async (req, res) => {
  await ReadingLists.destroy({ where: {} })
  await Session.destroy({ where: {} })
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {}})
  res.status(204).end()
})

module.exports = router