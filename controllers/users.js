const { User, Blog } = require('../models')
const router = require('express').Router()
const bcrypt = require('bcrypt')

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if(!(username && name && password)) {
      res.status(400).json({ error: 'Missing fields' })
      return
    } 

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      username,
      name,
      passwordHash
    })
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/', async(req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash']
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})

router.put('/:username', async(req, res) => {
  const username = req.params.username
  const user = await User.findOne({
    where: {
      username: username
    }
  })

  if(user) {
    user.name = req.body.name
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router