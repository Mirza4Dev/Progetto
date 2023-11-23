// authenticate.js

const connection = require('./connection');

async function authenticate(req, res, next) {
  try {
    const { email, password, category } = req.body;

    const db = await connection();
    const usersCollection = db.collection('utenti');

    // Cerca l'utente nel database in base all'email, password e categoria
    const user = await usersCollection.findOne({
      email,
      password,
      category,
    });

    if (user) {
      // Aggiungi l'utente autenticato all'oggetto di richiesta
      req.user = user;
      next(); // Passa alla funzione successiva nel ciclo di vita della richiesta
    } else {
      // Credenziali non valide o categoria non corrispondente
      console.error('Credenziali non valide o categoria non corrispondente');
      res.status(401).json({ error: 'Credenziali non valide o categoria non corrispondente' });
    }
  } catch (error) {
    console.error('Errore durante l\'autenticazione:', error.message);
    res.status(500).json({ error: 'Errore durante l\'autenticazione' });
  }
}

module.exports = { authenticate };
