// Nel tuo componente Review.js
import React, { useState } from 'react';

export default function Review({
  selectedRestaurant,
  user,
  closeReviewForm
}) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);


  async function handleReviewSubmit() {
    const newReview = {
      restaurant_Id: selectedRestaurant._id,
      user_Id: user._id,
      userName: user.name,
      text: reviewText,
      date: new Date().toISOString(),
      rating: rating
    };

    const response = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newReview),
    });

    if (response.ok) {
      closeReviewForm()
    } else {
      console.error('Errore durante l\'invio della recensione:', response.statusText);
    }
  }

  return (
    <div>
      <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
      <label>Rating: </label>
      <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="0" max="5" />
      <button onClick={handleReviewSubmit}>Invia Recensione</button>
    </div>
  );
}
