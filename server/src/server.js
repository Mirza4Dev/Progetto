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


app.get('/restaurants', async (req, res) => {
  const restaurants = await selectData('restaurants');
  res.status(200).json(restaurants);
});

app.get('/reservations', async (req, res) => {
  const reservations = await selectData('reservations');
  res.status(200).json(reservations);
});

app.get('/reservations/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  const userReservations = await selectData('reservations', { user_Id: userId });
  res.json(userReservations);
});

app.get('/reviews/:restaurantId', async (req, res) => {
  const restaurantId = req.params.restaurantId;

  const reviews = await selectData('reviews', { restaurant_Id: restaurantId });

  res.json(reviews);
});


//----------------------------POST

app.post('/login', authenticateLogin, (req, res) => {
  res.status(200).json({ token: req.token, user: req.currentUser });
});

app.post('/restaurants', async (req, res) => {
  const { restaurant_Id, name, description, photos, type, price, position } = req.body;

  const { cap, city, street } = position;

  await insertDocument('restaurants', {
    restaurant_Id,
    name,
    description,
    photos,
    type,
    price,
    position: {
      cap,
      city,
      street
    }
  });
  res.status(201).json({ message: 'Ristorante aggiunto con successo' });
});


app.post('/register', async (req, res) => {
  const { name, email, password, category } = req.body;
  const insertResult = await insertDocument('utenti', {
    name,
    email,
    password,
    category
  });
  if (insertResult) {
    res.status(200).json({ message: 'Registrazione avvenuta con successo' });
  } else {
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }

});


app.post('/restaurants/:id/reservations', async (req, res) => {
  const id = req.params.id;
  const reservation = req.body;
  const result = await selectData(id);

  if (result) {
    const response = await insertDocument("reservations", reservation);
    res.json(response);
  } else {
    res.status(404).json({ error: true, msg: 'Id not found' });
  }

});

app.post('/reviews', async (req, res) => {
  const { restaurant_Id, user_Id, userName, text, rating } = req.body;
  const newReview = {
    restaurant_Id,
    user_Id,
    userName,
    text,
    date: new Date().toISOString(),
    rating,
  };

  const result = await insertDocument('reviews', newReview);

  if (result) {
    res.status(200).json({ message: 'Grazie per aver inserito la recensione' });
  } else {
    res.status(404).json({ error: true, msg: 'Id not found' });
  }
});

//----------------DELETE

app.delete('/reservations/:id', async (req, res) => {
  const id = req.params.id;
  const result = await deleteData('reservations', id);

  if (result.deletedCount > 0) {
    res.status(200).json({ message: 'Prenotazione eliminata con successo' });
  } else {
    res.status(404).json({ error: true, msg: 'Prenotazione non trovata' });
  }
});

app.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const result = await deleteData('reviews', reviewId);

  if (result.deletedCount > 0) {
    res.status(200).json({ message: 'Recensione eliminata con successo' });
  } else {
    res.status(404).json({ error: true, msg: 'Recensione non trovata' });
  }
});


//-----------------------  PUT


app.put('/reviews/:id', async (req, res) => {
  console.log('Dati ricevuti dal frontend:', req.body);
  const reviewId = req.params.id;
  const { editedText } = req.body;

  const result = await updateData('reviews', reviewId, { text: editedText });

  if (result.modifiedCount > 0) {
    res.status(200).json({ message: 'Recensione modificata con successo' });
  } else {
    res.status(404).json({ error: true, msg: 'Recensione non trovata' });
  }

});

app.put('/reservations/:id', async (req, res) => {
  const reservationId = req.params.id;
  const { day, time, guests } = req.body;

  const updatedData = { day, time, guests };
  const result = await updateData('reservations', reservationId, updatedData);
  if (result.modifiedCount > 0) {
    res.status(200).json({ message: 'Prenotazione modificata con successo' });
  } else {
    res.status(404).json({ error: true, msg: 'Prenotazione non trovata' });
  }
});


//------------------------------LISTEN

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})