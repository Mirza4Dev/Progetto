// authMiddleware.js
const jwt = require('jsonwebtoken');
const selectData = require('./select-data');

const authenticateLogin = async (req, res, next) => {
  const { email, password, selectedCategory } = req.body;

  try {
    // Recupera l'utente corrente in base all'email
    const user = await selectData('utenti', { email });
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Verifica se le credenziali dell'utente corrispondono a quelle fornite nella richiesta
    if (email !== user.email || password !== user.password || selectedCategory !== user.category) {
      return res.status(403).json({ message: 'Credenziali non valide' });
    }

    // Se le credenziali sono valide, crea un token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '1h' });

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
