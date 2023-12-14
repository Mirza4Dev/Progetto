import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  });
  const [newPhoto, setNewPhoto] = useState('');
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);


  function handleNewRestaurantSubmit() {

    const restaurantData = {
      restaurant_Id: user._id,
      ...newRestaurant,
    };

    fetch('http://localhost:3000/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(restaurantData),
    })
      .then(response => {
        if (response.status !== 201) {
          throw new Error(`Errore durante l'inserimento del ristorante: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setNewRestaurant((prevRestaurant) => ({
          ...prevRestaurant,
          name: '',
          description: '',
          photo: [],
          type: '',
          price: '',
          position: {
            cap: '',
            city: '',
            street: ''
          },
          menu: {}
        }));
        setDishName('');
        setDishPrice('');

        alert('Ristorante aggiunto con successo!');
      })
      .catch(error => {
        console.error('Errore durante l\'inserimento del ristorante:', error.message);
        alert('Errore durante l\'inserimento del ristorante. Si prega di riprovare.');
      });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  function addPhoto() {
    if (newPhoto.trim()) {
      setNewRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        photos: [...prevRestaurant.photos, newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-4">Aggiungi Ristorante</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Descrizione</label>
              <textarea
                className="form-control"
                id="description"
                value={newRestaurant.description}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
              />
            </div>

          </form>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Tipologia cucina</label>
        <input
          type="text"
          className="form-control"
          id="type"
          value={newRestaurant.type}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, type: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="price" className="form-label">Prezzo</label>
        <input
          type="text"
          className="form-control"
          id="price"
          value={newRestaurant.price}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, price: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="newPhoto" className="form-label">Foto</label>
        <input
          type="text"
          className="form-control"
          id="newPhoto"
          value={newPhoto}
          onChange={(e) => setNewPhoto(e.target.value)}
        />
        <button type="button" className="btn btn-secondary mt-2" onClick={addPhoto}>
          Aggiungi Foto
        </button>
      </div>

      <div className="mt-3">
        <h4>Lista Foto</h4>
        <ul>
          {newRestaurant.photos.map((photo, index) => (
            <li key={index}>{photo}</li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <label htmlFor="position" className="form-label">Posizione</label>
        <div className="mb-3">
          <label htmlFor="cap" className="form-label">CAP</label>
          <input
            type="text"
            className="form-control"
            id="cap"
            value={newRestaurant.position.cap}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, position: { ...newRestaurant.position, cap: e.target.value } })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Città</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={newRestaurant.position.city}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, position: { ...newRestaurant.position, city: e.target.value } })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="street" className="form-label">Via</label>
          <input
            type="text"
            className="form-control"
            id="street"
            value={newRestaurant.position.street}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, position: { ...newRestaurant.position, street: e.target.value } })}
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="dishName" className="form-label">Nome Piatto</label>
        <input
          type="text"
          className="form-control"
          id="dishName"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="dishPrice" className="form-label">Prezzo</label>
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
            <li key={dish}>{dish}: {newRestaurant.menu[dish]}</li>
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
              menu: { ...prevRestaurant.menu, [dishName]: dishPrice }
            }));
            setDishName('');
            setDishPrice('');
          }
        }}
      >
        Aggiungi Piatto
      </button>
      <br /><br />

      <button type="button" className="btn btn-primary" onClick={handleNewRestaurantSubmit}>
        Aggiungi Ristorante
      </button>
      <div className="mt-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

