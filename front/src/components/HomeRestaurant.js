import React, { useState, useEffect } from 'react';

const HomeRestaurant = () => {
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
  });

  const [restaurants, setRestaurants] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Effettua la richiesta per ottenere la lista dei ristoranti e delle prenotazioni
    const fetchData = async () => {
      try {
        const restaurantsResponse = await fetch('http://localhost:3000/restaurants');
        const reservationsResponse = await fetch('http://localhost:3000/reservations');

        if (!restaurantsResponse.ok || !reservationsResponse.ok) {
          console.error('Errore durante il recupero dei dati.');
          return;
        }

        const restaurantsData = await restaurantsResponse.json();
        const reservationsData = await reservationsResponse.json();

        setRestaurants(restaurantsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };

    fetchData();
  }, []); // Esegui solo al montaggio del componente

  const handleNewRestaurantSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRestaurant),
      });

      if (response.ok) {
        console.log('Ristorante aggiunto con successo!');

        // Aggiorna la lista dei ristoranti dopo l'aggiunta di un nuovo ristorante
        const updatedRestaurantsResponse = await fetch('http://localhost:3000/restaurants');
        const updatedRestaurants = await updatedRestaurantsResponse.json();
        setRestaurants(updatedRestaurants);
      } else {
        const errorData = await response.json();
        console.error('Errore durante l\'aggiunta del ristorante:', errorData.message || 'Errore sconosciuto');
      }
    } catch (error) {
      console.error('Errore durante la richiesta di aggiunta del ristorante:', error);
    }
  };

  const handleLogout = () => {
    // Rimuovi il token di accesso e altri dati di autenticazione da localStorage
    localStorage.removeItem('access_token');

    // Puoi anche eseguire altre azioni post-logout, ad esempio navigare a una nuova pagina
  };


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestione Ristorante</h2>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nome Ristorante:</label>
        <input type="text" className="form-control" id="name" name="name" onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })} />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descrizione:</label>
        <textarea className="form-control" id="description" name="description" onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}></textarea>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleNewRestaurantSubmit}>Aggiungi Ristorante</button>

      {/* Visualizza la lista dei ristoranti */}
      <h2 className="mt-5 mb-4">Lista dei Ristoranti</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>{restaurant.name} - {restaurant.description}</li>
        ))}
      </ul>

      {/* Visualizza la lista delle prenotazioni */}
      <h2 className="mt-5 mb-4">Lista delle Prenotazioni</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation._id}>{reservation.day} - {reservation.time} - {reservation.guests}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomeRestaurant;
