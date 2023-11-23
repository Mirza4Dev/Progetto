import React, { useState } from 'react';

export default function HomeRestaurant({ user }) {
  const [restaurantName, setRestaurantName] = useState('');

  const handleAddRestaurant = async () => {
    try {
      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantName,
          ownerId: user._id, // Assuming user object contains the ID of the logged-in user
        }),
      });

      if (response.ok) {
        console.log('Ristorante aggiunto con successo');
        // Puoi fare qualcosa qui, come aggiornare lo stato per riflettere il nuovo ristorante
      } else {
        console.error('Errore durante l\'aggiunta del ristorante');
      }
    } catch (error) {
      console.error('Errore durante la richiesta di aggiunta del ristorante:', error);
    }
  };

  return (
    <div>
      <h2>Benvenuto, {user.name}!</h2>
      <h3>Inserisci Ristorante</h3>
      <div>
        <label htmlFor="restaurantName">Nome Ristorante:</label>
        <input
          type="text"
          id="restaurantName"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
        <button onClick={handleAddRestaurant}>Aggiungi Ristorante</button>
      </div>
      <h3>Gestione delle Prenotazioni</h3>
    </div>
  );
}
