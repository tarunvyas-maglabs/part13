const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')

  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)
      
      const session = await Session.findOne({
        where: {
          token
        }
      })

      if(!session) {
        return res.status(401).json({ error: 'invalid session' })
      }
      req.decodedToken = decodedToken
      req.token = token

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token misisng' })
  }
  next()
}

module.exports = {
  tokenExtractor
}