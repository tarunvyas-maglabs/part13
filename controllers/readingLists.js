const router = require('express').Router()
const { ReadingLists, User, Blog } = require('../models') 
const { tokenExtractor }  = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body

    if (!(userId && blogId)) {
      res.status(400).send({ error: 'Blog id or user id is missing' })
      return
    }

    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)
    if (!(user && blog)) {
      res.status(404).send({ error: 'Blog or user could not be found' })
      return
    }
    const existing = await ReadingLists.findOne({
      where: {
        blogId,
        userId
      }
    })
    if (existing) {
      res.status(400).send({ error: 'blog already in reading list' })
      return
    }
    const reading = await ReadingLists.create({ blogId, userId })
    res.status(200).json({
      id: reading.id,
      user_id: reading.userId,
      blog_id: reading.blogId,
      read: reading.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const { read } = req.body
    const readingListEntry = await ReadingLists.findByPk(req.params.id)
    if (!readingListEntry) {
      res.status(404).json({ error: 'reading not found' })
      return
    }
    if (readingListEntry.userId !== req.decodedToken.id) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    readingListEntry.read = read
    await readingListEntry.save()
    res.status(200).json(readingListEntry)
  } catch (error) {
    next(error)
  }
})

module.exports = router