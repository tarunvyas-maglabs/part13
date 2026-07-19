const router = require('express').Router()

const { ReadingLists, User, Blog } = require('../models') 

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body
    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)
    if (!(user && blog)) {
      res.status(400).send({ error: 'Blog or user could not be found' })
      return
    }
    const reading = await ReadingLists.create({ blogId, userId })
    res.json(reading)
  } catch (error) {
    next(error)
  }
})

module.exports = router