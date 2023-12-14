import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditReservation({ reservation, setShowEditModal }) {
  const [newDay, setNewDay] = useState(reservation.day);
  const [newTime, setNewTime] = useState(reservation.time);
  const [newGuests, setNewGuests] = useState(reservation.guests);

  const handleEditReservation = async () => {
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
      setShowEditModal(false);
    } else {
      console.error('Errore durante la modifica della prenotazione:', response.statusText);
      alert('Errore durante la modifica della prenotazione');
    }
  };


  return (
    <Modal show={() => setShowEditModal(true)} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Prenotazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="newDay">
            <Form.Label>Nuovo Giorno:</Form.Label>
            <Form.Control type="date" value={newDay} onChange={(e) => setNewDay(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="newTime">
            <Form.Label>Nuova Ora:</Form.Label>
            <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="newGuests">
            <Form.Label>Nuovo Numero di Ospiti:</Form.Label>
            <Form.Control type="number" value={newGuests} onChange={(e) => setNewGuests(e.target.value)} />
          </Form.Group>

          <Button variant="primary" onClick={handleEditReservation}>
            Conferma Modifica
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
