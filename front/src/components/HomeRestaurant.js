import React, { useState, useEffect } from 'react';

const HomeRestaurant = () => {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
  });
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleNewRestaurantSubmit = async () => {
    const restaurantData = {
      restaurant_Id: user._id,
      ...newRestaurant
    };
    try {

      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(restaurantData),
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'inserimento del ristorante');
      }

      setNewRestaurant({
        name: '',
        description: '',
      });

      alert('Ristorante aggiunto con successo!');
    } catch (error) {
      console.error('Errore durante l\'inserimento del ristorante:', error);
      alert('Errore durante l\'inserimento del ristorante. Si prega di riprovare.');
    }
  };

  useEffect(() => {
    const fetchUserRestaurants = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${user._id}/restaurants`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Errore durante il recupero dei ristoranti dell\'utente');
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Errore durante il recupero dei ristoranti dell\'utente:', error);
      }
    };

    fetchUserRestaurants();
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
  };

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
            <button type="button" className="btn btn-primary" onClick={handleNewRestaurantSubmit}>
              Aggiungi Ristorante
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h2 className="mb-4">Lista dei Ristoranti</h2>
          <ul className="list-group">
            {restaurants.map((restaurant) => (
              <li key={restaurant._id} className="list-group-item">
                {restaurant.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomeRestaurant;
