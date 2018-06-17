const jwt = require('jsonwebtoken')
const APP_SECRET = 's3cr3t!'

function getUserId(context) {
  const Authorization = context.headers['authorization']
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
  return userId
}

module.exports = {
  APP_SECRET,
  getUserId,
}