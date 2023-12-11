import React, { useState } from 'react';

export default function EditReview({ reviewId, currentText, cancelEditReview, closeReviewForm }) {
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
        closeReviewForm();
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
    <div>
      <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      <button onClick={handleEditReview}>Conferma</button>
      <button onClick={cancelEditReview}>Annulla</button>
    </div>
  );
}
