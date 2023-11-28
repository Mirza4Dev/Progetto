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
    <div className="container mt-4">
      <h2>Prenota presso {selectedRestaurant.name}</h2>
      <form>
        <div className="form-group">
          <label htmlFor="day">Giorno:</label>
          <input
            type="date"
            id="day"
            className="form-control"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Ora:</label>
          <input
            type="time"
            id="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">Ospiti:</label>
          <input
            type="number"
            id="guests"
            className="form-control"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onReservationSubmit}
        >
          Prenota
        </button>
      </form>
    </div>
  );
};

export default Reservation;