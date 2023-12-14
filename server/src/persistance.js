// authMiddleware.js
const jwt = require('jsonwebtoken');
const selectData = require('./select-data');

const authenticateLogin = async (req, res, next) => {
  const { email, password, selectedCategory } = req.body;

  const users = await selectData('utenti', { email });


  const user = users.find(u => u.email === email && u.password === password && u.category === selectedCategory);

  if (!user) {
    return res.status(403).json({ message: 'Credenziali non valide' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  req.currentUser = user;
  req.token = token;

  next();
};

module.exports = { authenticateLogin };
