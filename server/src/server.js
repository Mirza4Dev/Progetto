const express = require('express')
const app = express()
require('dotenv').config()
const { authenticateLogin } = require('./persistance')
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

const bodyparser = require('body-parser')
app.use(bodyparser.json())
const cors = require('cors');
app.use(cors());

const selectData = require('./select-data')
const insertDocument = require('./insert')
const deleteData = require('./delete-data')
const updateData = require('./update-data')


//-------------------------GET

app.get('/users', async (req, res) => {
  const users = await selectData('utenti');
  res.status(200).json(users);
});

// app.get('/users/:id/restaurants', async (req, res) => {
//   const id = req.params.id;
//   const restaurants = await selectData('ristoranti', { restaurant_Id: id });
//   res.status(200).json(restaurants);
// });

app.get('/restaurants', async (req, res) => {
  const restaurants = await selectData('ristoranti');
  res.status(200).json(restaurants);
});

app.get('/reservations', async (req, res) => {
  const reservations = await selectData('reservations');
  res.status(200).json(reservations);
});

app.get('/reservations/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId)
  try {
    // Usa il modulo selectData per ottenere le prenotazioni dell'utente
    const userReservations = await selectData('reservations', { user_Id: userId });
    console.log(userReservations)

    res.json(userReservations);
  } catch (error) {
    console.error('Errore durante il recupero delle prenotazioni dell\'utente:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});



//----------------------------POST

app.post('/login', authenticateLogin, (req, res) => {
  // L'oggetto req ora contiene req.currentUser e req.token
  res.status(200).json({ token: req.token, user: req.currentUser });
});





app.post('/restaurants', async (req, res) => {
  const { restaurant_Id, name, description } = req.body;
  await insertDocument('ristoranti', {
    restaurant_Id,
    name,
    description
  });

  res.status(201).json({ message: 'Ristorante aggiunto con successo' });

});


app.post('/register', async (req, res) => {
  const { name, email, password, category } = req.body;

  // Esegui l'inserimento dei dati nel tuo database
  const insertResult = await insertDocument('utenti', {
    name,
    email,
    password,
    category
  });
  // Verifica se l'inserimento è avvenuto con successo
  if (insertResult) {
    // Rispondi con un messaggio di successo
    res.status(200).json({ message: 'Registrazione avvenuta con successo' });
  } else {
    // Se l'inserimento non è avvenuto correttamente, rispondi con un errore
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }

});


app.post('/restaurants/:id/reservations', async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = req.body;

    const result = await selectData(id);

    if (result) {
      const response = await insertDocument("reservations", reservation);
      res.json(response);
    } else {
      res.status(404).json({ error: true, msg: 'Id not found' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: true, msg: 'Internal Server Error' });
  }
});


//----------------DELETE

app.delete('/reservations/:id', async (req, res) => {
  const id = req.params.id;
  console.log('ID ricevuto:', id);

  try {
    const result = await deleteData('reservations', id);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Prenotazione eliminata con successo' });
    } else {
      res.status(404).json({ error: true, msg: 'Prenotazione non trovata' });
    }
  } catch (error) {
    console.error('Errore durante l\'eliminazione della prenotazione:', error);
    res.status(500).json({ error: true, msg: 'Errore interno del server' });
  }
});



//------------------------------LISTEN

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})