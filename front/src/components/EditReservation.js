import React, { useState } from 'react';

export default function EditReservation({ reservation, onClose }) {
  const [newDay, setNewDay] = useState(reservation.day);
  const [newTime, setNewTime] = useState(reservation.time);
  const [newGuests, setNewGuests] = useState(reservation.guests);

  const handleEditReservation = async () => {
    try {
      const reservationId = reservation._id
      const updatedData = {
        day: newDay,
        time: newTime,
        guests: newGuests,
      };

      const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });
      console.log(reservation._id)
      if (response.ok) {
        alert('Prenotazione modificata con successo!');
        onClose();
      } else {
        console.error('Errore durante la modifica della prenotazione:', response.statusText);
        alert('Errore durante la modifica della prenotazione');
      }
    } catch (error) {
      console.error('Errore durante la modifica della prenotazione:', error);
      alert('Errore durante la modifica della prenotazione');
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      {/* ... Resto del codice del modale come nell'esempio precedente ... */}

      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modifica Prenotazione</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          {/* Contenuto della finestra modale */}
          <label htmlFor="newDay" className="form-label">Nuovo Giorno:</label>
          <input type="date" id="newDay" className="form-control" value={newDay} onChange={(e) => setNewDay(e.target.value)} />

          <label htmlFor="newTime" className="form-label">Nuova Ora:</label>
          <input type="time" id="newTime" className="form-control" value={newTime} onChange={(e) => setNewTime(e.target.value)} />

          <label htmlFor="newGuests" className="form-label">Nuovo Numero di Ospiti:</label>
          <input type="number" id="newGuests" className="form-control" value={newGuests} onChange={(e) => setNewGuests(e.target.value)} />

          <button className="btn btn-primary mt-3" onClick={handleEditReservation}>Conferma Modifica</button>
        </div>
      </div>
    </div>
  );
}
