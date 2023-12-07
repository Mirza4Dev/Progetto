// authMiddleware.js
const jwt = require('jsonwebtoken');
const selectData = require('./select-data');

const authenticateLogin = async (req, res, next) => {
  const { email, password, selectedCategory } = req.body;

  try {
    // Recupera gli utenti corrispondenti all'email
    const users = await selectData('utenti', { email });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Trova il primo utente che corrisponde alle credenziali fornite
    const user = users.find(u => u.email === email && u.password === password && u.category === selectedCategory);

    if (!user) {
      return res.status(403).json({ message: 'Credenziali non valide' });
    }

    // Se le credenziali sono valide, crea un token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Aggiungi l'utente corrente e il token all'oggetto req
    req.currentUser = user;
    req.token = token;

    next(); // Passa alla gestione della route
  } catch (error) {
    console.error('Errore durante l\'autenticazione della login:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

module.exports = { authenticateLogin };
