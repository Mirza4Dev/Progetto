import React, { useState } from 'react';

const Review = ({ selectedRestaurant, user, closeReviewForm, setReviews, reviews }) => {
  const [reviewText, setReviewText] = useState('');

  const handleReviewSubmit = async () => {
    const review = {
      restaurant_Id: selectedRestaurant._id,
      user_Id: user._id,
      userName: user.name,
      text: reviewText,
    }
    console.log('Inizio handleReviewSubmit');
    try {
      // Invia la recensione al backend
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),

      });

      if (!response.ok) {
        throw new Error('Errore durante l\'invio della recensione');
      } else {

        alert('Recensione aggiunta');
      }


    } catch (error) {
      console.error('Errore durante l\'invio della recensione:', error);
      alert('Errore durante la recensione. Si prega di riprovare.');
    }
    console.log('Fine handleReviewSubmit');
  };

  return (
    <div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Inserisci la tua recensione..."
      />
      <button onClick={handleReviewSubmit}>Invia recensione</button>
    </div>
  );
};

export default Review;
