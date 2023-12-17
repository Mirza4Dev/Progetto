import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

export default function EditReservation({ reservation, setShowEditModal }) {
  const [newDay, setNewDay] = useState(reservation.day)
  const [newTime, setNewTime] = useState(reservation.time)
  const [newGuests, setNewGuests] = useState(reservation.guests)

  const handleEditReservation = async () => {
    if (!newDay || !newTime || !newGuests) {
      alert('Completa tutti i campi della prenotazione.')
      return
    }

    const reservationId = reservation._id
    const updatedData = {
      day: newDay,
      time: newTime,
      guests: newGuests,
    }

    const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {

      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    if (response.ok) {
      alert('Prenotazione modificata con successo!')
      setShowEditModal(false)
    } else {
      alert('Errore durante la modifica della prenotazione')
    }
  }


  return (
    <>

      <Form>
        <Form.Group>
          <Form.Label>Giorno:</Form.Label>
          <Form.Control type="date" value={newDay} onChange={(e) => setNewDay(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Ora:</Form.Label>
          <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Numero di Ospiti:</Form.Label>
          <Form.Control type="number" value={newGuests} onChange={(e) => setNewGuests(e.target.value)} />
        </Form.Group>

        <Button variant="primary" onClick={handleEditReservation}>
          Conferma Modifica
        </Button>
      </Form>
    </>
  )
}
