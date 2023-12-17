import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'


const Reservation = ({ selectedRestaurant, user, setMyReservations, myReservations, setShowReservationModal }) => {
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('')

  const onReservationSubmit = async () => {
    if (!day || !time || !guests) {
      alert('Completa tutti i campi della prenotazione.')
      return
    }

    const reservation = {
      restaurant_Id: selectedRestaurant._id,
      user_Id: user._id,
      name: selectedRestaurant.name,
      day,
      time,
      guests,
    }

    let res = await fetch(`http://localhost:3000/restaurants/${selectedRestaurant._id}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })

    const newReservations = [...myReservations, reservation]
    if (res.ok) {
      setMyReservations(newReservations)
      setShowReservationModal()
      alert('Prenotazione aggiunta')
    }


  }

  return (
    <div className="container mt-3">
      <div className="mx-5">
        <Form className="form-inline">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="day" className="mr-2">Giorno:</Form.Label>
            <Form.Control
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="time" className="mr-2">Ora:</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="guests" className="mr-2">Ospiti:</Form.Label>
            <Form.Control
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </Form.Group>
          <Button
            type="button"
            variant="primary"
            className="mb-3"
            onClick={onReservationSubmit}
          >
            Conferma
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Reservation