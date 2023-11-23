const express = require('express')
const app = express()
require('dotenv').config()
const { authenticate } = require('./persistance')
const fs = require('fs').promises;

const bodyparser = require('body-parser')
app.use(bodyparser.json())
const cors = require('cors');
app.use(cors());

const selectData = require('./select-data')
const insertUser = require('./insert')
const deleteData = require('./delete-data')
const updateData = require('./update-data')


app.get('/users', async (req, res) => {
  try {
    const users = await selectData('utenti');
    res.status(200).json(users);
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error.message);
    res.status(500).json({ error: 'Errore durante il recupero degli utenti' });
  }
});

app.get('/restaurants', async (req, res) => {
  try {
    const db = await connection();
    const usersCollection = db.collection('utenti');
    const restaurants = await usersCollection.find({ category: 'ristoratore' }).toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Errore durante il recupero dei ristoranti:', error.message);
    res.status(500).json({ error: 'Errore durante il recupero dei ristoranti' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, category } = req.body;

    // Esegui l'inserimento dei dati nel tuo database
    await insertUser({ name, email, password, category });

    // Rispondi con un messaggio di successo
    res.status(200).json({ message: 'Registrazione avvenuta con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }
});

app.post('/login', authenticate, (req, res) => {
  try {
    // Se il middleware ha eseguito con successo l'autenticazione, puoi accedere all'utente attraverso req.user
    res.status(200).json({ message: 'Accesso riuscito', user: { ...req.user, category: req.body.category } });
  } catch (error) {
    console.error(error);
    // Modifica la risposta per gestire il caso in cui le credenziali non sono valide
    res.status(401).json({ error: 'Credenziali non valide' });
  }
});

app.get('/reservations', authenticate, async (req, res) => {
  try {
    const db = await connection();
    const reservationsCollection = db.collection('prenotazioni');

    // Ottieni tutte le prenotazioni per il ristoratore autenticato
    const reservations = await reservationsCollection.find({ restaurantId: req.user._id }).toArray();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Errore durante il recupero delle prenotazioni:', error.message);
    res.status(500).json({ error: 'Errore durante il recupero delle prenotazioni' });
  }
});

// Route per confermare una prenotazione
app.put('/reservations/:id/confirm', authenticate, async (req, res) => {
  try {
    const db = await connection();
    const reservationsCollection = db.collection('prenotazioni');
    const reservationId = req.params.id;

    // Controlla se la prenotazione appartiene al ristoratore autenticato
    const reservation = await reservationsCollection.findOne({
      _id: new ObjectId(reservationId),
      restaurantId: req.user._id,
    });

    if (reservation) {
      // Esegui l'azione di conferma della prenotazione qui
      await updateData('prenotazioni', { _id: new ObjectId(reservationId) }, { $set: { confermata: true } });

      res.status(200).json({ message: 'Prenotazione confermata con successo' });
    } else {
      // La prenotazione non appartiene al ristoratore autenticato
      res.status(403).json({ error: 'Accesso negato. La prenotazione non appartiene al ristoratore' });
    }
  } catch (error) {
    console.error('Errore durante la conferma della prenotazione:', error.message);
    res.status(500).json({ error: 'Errore durante la conferma della prenotazione' });
  }
});

// Route per annullare una prenotazione
app.delete('/reservations/:id', authenticate, async (req, res) => {
  try {
    const db = await connection();
    const reservationsCollection = db.collection('prenotazioni');
    const reservationId = req.params.id;

    // Controlla se la prenotazione appartiene al ristoratore autenticato
    const reservation = await reservationsCollection.findOne({
      _id: new ObjectId(reservationId),
      restaurantId: req.user._id,
    });

    if (reservation) {
      // Esegui l'azione di annullamento della prenotazione qui

      res.status(200).json({ message: 'Prenotazione annullata con successo' });
    } else {
      // La prenotazione non appartiene al ristoratore autenticato
      res.status(403).json({ error: 'Accesso negato. La prenotazione non appartiene al ristoratore' });
    }
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error.message);
    res.status(500).json({ error: 'Errore durante l\'annullamento della prenotazione' });
  }
});




app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})