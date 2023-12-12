import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function EditReview({ reviewId, currentText, cancelEditReview, setShowEditReviewModal }) {
  const [editedText, setEditedText] = useState(currentText);

  async function handleEditReview() {
    console.log('editedText:', editedText);
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ editedText }),
      });

      if (response.ok) {
        setShowEditReviewModal(false);
        alert('Recensione modificata con successo!');
      } else if (response.status === 404) {
        console.error('Recensione non trovata:', response.statusText);
      } else {
        console.error('Errore durante la modifica della recensione:', response.statusText);
      }
    } catch (error) {
      console.error('Errore durante la modifica della recensione:', error);
    }
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Modifica Recensione</Form.Label>
        <Form.Control as="textarea" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      </Form.Group>

      <Button variant="primary" onClick={handleEditReview}>
        Conferma
      </Button>
      <Button variant="secondary" onClick={cancelEditReview}>
        Annulla
      </Button>
    </Form>
  );
}
