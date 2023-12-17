const express = require('express')
const app = express()
require('dotenv').config()
const { authenticateLogin, authenticateToken } = require('./persistance')
const bcrypt = require('bcryptjs')

const bodyparser = require('body-parser')
app.use(bodyparser.json())
const cors = require('cors')
app.use(cors())

const selectData = require('./select-data')
const insertDocument = require('./insert')
const deleteData = require('./delete-data')
const updateData = require('./update-data')


//-------------------------GET

app.get('/users', async (req, res) => {
  const users = await selectData('users')
  res.status(200).json(users)
})


app.get('/restaurants', async (req, res) => {
  const restaurants = await selectData('restaurants')
  res.status(200).json(restaurants)
})


app.get('/reservations', async (req, res) => {
  const reservations = await selectData('reservations')
  res.status(200).json(reservations)
})

app.get('/reservations/user/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId

  if (req.user.userId !== userId) {
    return res.status(403).json({ error: 'Accesso vietato. Non hai i permessi necessari.' })
  }

  const userReservations = await selectData('reservations', { user_Id: userId })
  res.json(userReservations)
})

app.get('/reviews/:restaurantId', async (req, res) => {
  const restaurantId = req.params.restaurantId

  const reviews = await selectData('reviews', { restaurant_Id: restaurantId })

  res.json(reviews)
})


//----------------------------POST

app.post('/login', authenticateLogin, (req, res) => {
  res.status(200).json({ token: req.token, user: req.currentUser })
})

app.post('/register', async (req, res) => {
  const { name, email, password, category } = req.body

  const existingNameUser = await selectData('users', { name });
  const existingEmailUser = await selectData('users', { email });
  if (existingEmailUser[0] || existingNameUser[0]) {

    if (existingEmailUser[0]) {
      console.log("1 if")
      return res.status(400).json({ error: 'Email già registrato' });
    } else {
      console.log("else")
      return res.status(400).json({ error: 'Nome già registrato' });
    }
  }



  const hashedPassword = await bcrypt.hash(password, 10)
  const insertResult = await insertDocument('users', {
    name,
    email,
    password: hashedPassword,
    category
  })
  if (insertResult) {
    console.log("insert if")

    res.status(200).json({ message: 'Registrazione avvenuta con successo' })
  } else {
    console.log("else")

    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' })
  }
})


app.post('/restaurants', async (req, res) => {
  const { restaurant_Id, name, description, photos, type, price, position, menu } = req.body

  const { cap, city, street } = position

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
    },
    menu
  })
  res.status(201).json({ message: 'Ristorante aggiunto con successo' })
})





app.post('/restaurants/:id/reservations', async (req, res) => {
  const id = req.params.id
  const reservation = req.body
  const result = await selectData(id)

  if (result) {
    const response = await insertDocument("reservations", reservation)
    res.json(response)
  } else {
    res.status(404).json({ error: true, msg: 'Id not found' })
  }

})

app.post('/reviews', async (req, res) => {
  const { restaurant_Id, user_Id, userName, text, rating } = req.body
  const newReview = {
    restaurant_Id,
    user_Id,
    userName,
    text,
    date: new Date().toISOString(),
    rating,
  }

  const result = await insertDocument('reviews', newReview)

  if (result) {
    res.status(200).json({ message: 'Grazie per aver inserito la recensione' })
  } else {
    res.status(404).json({ error: true, msg: 'Id not found' })
  }
})

//----------------DELETE

app.delete('/reservations/:id', async (req, res) => {
  const id = req.params.id
  const result = await deleteData('reservations', id)

  if (result.deletedCount > 0) {
    res.status(200).json({ message: 'Prenotazione eliminata con successo' })
  } else {
    res.status(404).json({ error: true, msg: 'Prenotazione non trovata' })
  }
})

app.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id
  const result = await deleteData('reviews', reviewId)

  if (result.deletedCount > 0) {
    res.status(200).json({ message: 'Recensione eliminata con successo' })
  } else {
    res.status(404).json({ error: true, msg: 'Recensione non trovata' })
  }
})


//-----------------------  PUT


app.put('/reviews/:id', async (req, res) => {

  const reviewId = req.params.id
  const { editedText, editedRating } = req.body

  const result = await updateData('reviews', reviewId, { text: editedText, rating: editedRating })

  if (result.modifiedCount > 0) {
    res.status(200).json({ message: 'Recensione modificata con successo' })
  } else {
    res.status(404).json({ error: true, msg: 'Recensione non trovata' })
  }

})

app.put('/reservations/:id', async (req, res) => {
  const reservationId = req.params.id
  const { day, time, guests } = req.body

  const updatedData = { day, time, guests }
  const result = await updateData('reservations', reservationId, updatedData)
  if (result.modifiedCount > 0) {
    res.status(200).json({ message: 'Prenotazione modificata con successo' })
  } else {
    res.status(404).json({ error: true, msg: 'Prenotazione non trovata' })
  }
})


//------------------------------LISTEN

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})