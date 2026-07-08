const router = require('express').Router()
const { Blog } = require('../models/index')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
}) 

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const blog = Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    console.log(blog.toJSON())
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router