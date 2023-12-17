import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap'

export default function HomeRestaurant() {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    photos: [],
    type: '',
    price: '',
    position: {
      cap: '',
      city: '',
      street: ''
    },
    menu: {}
  })
  const [newPhoto, setNewPhoto] = useState('')
  const [dishName, setDishName] = useState('')
  const [dishPrice, setDishPrice] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])


  async function handleNewRestaurantSubmit() {
    const restaurantData = {
      restaurant_Id: user._id,
      ...newRestaurant,
    }

    const response = await fetch('http://localhost:3000/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    })
    await response.json()

    setNewRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      name: '',
      description: '',
      photos: [],
      type: '',
      price: '',
      position: {
        cap: '',
        city: '',
        street: '',
      },
      menu: {},
    }))
    setDishName('')
    setDishPrice('')

    alert('Ristorante aggiunto con successo!')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function addPhoto() {
    const trimmedPhoto = newPhoto.trim()

    if (trimmedPhoto) {
      setNewRestaurant(() => ({
        ...newRestaurant,
        photos: [...newRestaurant.photos, trimmedPhoto],
      }))
      setNewPhoto('')
    }
  }


  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h2 className="mb-4">Aggiungi Ristorante</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Nome</Form.Label>
              <Form.Control
                type="text"
                id="name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="description">Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                value={newRestaurant.description}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="type">Tipologia cucina</Form.Label>
              <Form.Control
                type="text"
                id="type"
                value={newRestaurant.type}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, type: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="price">Prezzo</Form.Label>
              <Form.Control
                type="text"
                id="price"
                value={newRestaurant.price}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, price: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <div className="mb-3">
        <Form.Label htmlFor="newPhoto">Foto</Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            id="newPhoto"
            value={newPhoto}
            onChange={(e) => setNewPhoto(e.target.value)}
          />
          <Button variant="secondary" onClick={addPhoto}>
            Aggiungi Foto
          </Button>
        </InputGroup>
      </div>
      <div className="mt-3">
        <h4>Lista Foto</h4>
        <ListGroup>
          {newRestaurant.photos.map((photo, index) => (
            <ListGroup.Item key={index}>{photo}</ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      <div className="mb-3">
        <label htmlFor="dishName" className="form-label">
          Nome Piatto
        </label>
        <input
          type="text"
          className="form-control"
          id="dishName"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="dishPrice" className="form-label">
          Prezzo
        </label>
        <input
          type="text"
          className="form-control"
          id="dishPrice"
          value={dishPrice}
          onChange={(e) => setDishPrice(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <h4>Menu</h4>
        <ul>
          {Object.keys(newRestaurant.menu).map((dish) => (
            <li key={dish}>
              {dish}: {newRestaurant.menu[dish]}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="btn btn-secondary mt-2"
        onClick={() => {
          if (dishName && dishPrice) {
            setNewRestaurant((prevRestaurant) => ({
              ...prevRestaurant,
              menu: { ...prevRestaurant.menu, [dishName]: dishPrice },
            }))
            setDishName('')
            setDishPrice('')
          }
        }}
      >
        Aggiungi Piatto
      </button>
      <br />
      <br />

      <button type="button" className="btn btn-primary" onClick={handleNewRestaurantSubmit}>
        Aggiungi Ristorante
      </button>
      <div className="mt-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </Container >
  )
}

