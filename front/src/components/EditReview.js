import React, { useState } from 'react';

const EditReview = ({ reviewId, currentText, onEditReview, onCancelEdit }) => {
  const [editedText, setEditedText] = useState(currentText);

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleEditReview = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editedText }), // Assicurati che la chiave sia "text"
      });

      if (response.ok) {
        onEditReview(reviewId, editedText);
      } else if (response.status === 404) {
        console.error('Recensione non trovata:', response.statusText);
      } else {
        console.error('Errore durante la modifica della recensione:', response.statusText);
      }

    } catch (error) {
      console.error('Errore durante la modifica della recensione:', error);
    }
  };

  const handleCancelEdit = () => {
    onCancelEdit();
  };

  return (
    <div>
      <textarea value={editedText} onChange={handleTextChange} />
      <button onClick={handleEditReview}>Conferma</button>
      <button onClick={handleCancelEdit}>Annulla</button>
    </div>
  );
};

export default EditReview;

