import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

export default function EditReview({ reviewId, currentText, currentRating, setEditingReviewId, setShowEditReviewModal }) {
  const [editedText, setEditedText] = useState(currentText)
  const [editedRating, setEditedRating] = useState(currentRating)

  async function handleEditReview() {
    const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ editedText, editedRating }),
    })

    if (response.ok) {
      setShowEditReviewModal(false)
      alert('Recensione modificata con successo!')
    } else {
      console.log('Errore durante la modifica della recensione')
    }
  }
  function handleCancelEditReview() {
    setEditingReviewId(null)
    setShowEditReviewModal(false)
  }
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Modifica Recensione</Form.Label>
        <Form.Control as="textarea" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Modifica Rating</Form.Label>
        <Form.Control type="number" value={editedRating} onChange={(e) => setEditedRating(e.target.value)} />
      </Form.Group>

      <Button variant="primary" onClick={handleEditReview}>
        Conferma
      </Button>
      <Button variant="secondary" onClick={handleCancelEditReview}>
        Annulla
      </Button>
    </Form>
  )
}
