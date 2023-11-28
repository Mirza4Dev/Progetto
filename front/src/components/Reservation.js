import React, { useState } from 'react';

const Reservation = ({ selectedRestaurant, user }) => {
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');

  const onReservationSubmit = async () => {
    // Verifica che tutti i campi siano compilati
    if (!day || !time || !guests) {
      alert('Completa tutti i campi della prenotazione.');
      return;
    }

    // Crea un oggetto con i dati della prenotazione
    const reservation = {
      restaurant_Id: selectedRestaurant._id,
      user_Id: user._id, // Utilizza il valore passato come prop
      name: selectedRestaurant.name,
      day,
      time,
      guests,
    };

    try {
      // Effettua la richiesta POST al tuo endpoint di prenotazione
      const response = await fetch(`http://localhost:3000/restaurants/${selectedRestaurant._id}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assicurati di includere il token nel caso di autenticazione
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(reservation),
      });

      if (!response.ok) {
        throw new Error('Errore durante la prenotazione');
      }

      // Aggiorna lo stato o esegui altre azioni in base alla risposta del server

      alert('Prenotazione effettuata con successo!');
    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      alert('Errore durante la prenotazione. Si prega di riprovare.');
    }
  };

  return (
    <div>
      <h2>Prenota presso {selectedRestaurant.name}</h2>
      <div>
        <label htmlFor="day">Giorno:</label>
        <input type="text" id="day" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>
      <div>
        <label htmlFor="time">Ora:</label>
        <input type="text" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <label htmlFor="guests">Ospiti:</label>
        <input type="text" id="guests" value={guests} onChange={(e) => setGuests(e.target.value)} />
      </div>
      <button onClick={onReservationSubmit}>Prenota</button>
    </div>
  );
};

export default Reservation;
