const router = require('express').Router()

const sequelize = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: ['author', [sequelize.fn('COUNT', sequelize.col('*')), 'blogs'], [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
    order: [
      ['likes', 'DESC']
    ]
  })

  res.json(authors)
})

module.exports = router