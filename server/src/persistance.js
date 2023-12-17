const selectData = require('./select-data')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const authenticateLogin = async (req, res, next) => {
  const { email, password, selectedCategory } = req.body

  const user = await selectData('users', { email })

  const userMatch = user.find(u => u.email === email && u.category === selectedCategory)
  if (userMatch) {
    const passwordMatch = await bcrypt.compare(password, userMatch.password)
    if (!userMatch || !passwordMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' })
    }
    const token = jwt.sign({ userId: userMatch._id }, process.env.JWT_SECRET)
    req.token = token
    req.currentUser = userMatch
  }
  next()
}


const authenticateToken = (req, res, next) => {
  const authorization = req.header('Authorization')
  const token = authorization.slice(7)
  if (!token) {
    return res.status(401).json({ error: 'Accesso non autorizzato. Token mancante.' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decoded
  next()

}


module.exports = { authenticateLogin, authenticateToken }


