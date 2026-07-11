const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

router.post('/', async (req, res, next) => {

    const { username, password } = req.body

    if (!(username && password)) {
      return res.status(401).json({
        error: 'needs username and password'
      })
    }

    const user = await User.findOne({
      where: {
        username
      }
    })

    const passwordCorrect = user === null ? false: await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }
    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = await jwt.sign(userForToken, SECRET)

    res.status(200).send({ token, username: user.username, name: user.name })

})

module.exports = router


