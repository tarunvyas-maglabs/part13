const router = require('express').Router()
const { Blog, User} = require('../models/index')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token misisng' })
  }
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: {
        title: {
          [Op.substring]: req.query.search
        },
        author: {
          [Op.substring]: req.query.search
        }
      }
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ['id', 'passwordHash']
      }
    },
    attributes: {
      exclude: ['userId']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  });
  res.json(blogs)
}) 

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      console.log(blog.toJSON())
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      if(blog.userId === user.id) {
        await blog.destroy()
      } else {
        return res.status(401).json({ error: 'unauthorized' })
      }
    } 
    res.status(204).end()
})

module.exports = router