import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

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
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Recensione</Form.Label>
        <Form.Control as="textarea" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <Form.Control type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="0" max="5" />
      </Form.Group>

      <Button variant="primary" onClick={handleReviewSubmit}>
        Invia Recensione
      </Button>
    </Form>
  );
}
