const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Session } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

router.post('/', async (req, res, next) => {

  try {

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

      console.log(user.id)

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
      
      await Session.create({
        token,
        userId: user.id
      })

      res.status(200).send({ token, username: user.username, name: user.name })

  } catch (error) {
    next(error)
  }

})

module.exports = router


