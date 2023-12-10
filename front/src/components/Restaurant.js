import React, { useState, useEffect } from 'react';
import Reservation from './Reservation';
import Review from './Review';
import EditReview from './EditReview';

export default function Restaurant({ selectedRestaurant, user, setMyReservations, myReservations }) {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);




  useEffect(function () {
    async function fetchReviews() {
      const response = await fetch(`http://localhost:3000/reviews/${selectedRestaurant._id}`);
      if (!response.ok) {
        throw new Error('Errore durante il recupero delle recensioni');
      }
      const fetchedReviews = await response.json();
      setReviews(fetchedReviews);
    }
    fetchReviews();
  }, [selectedRestaurant._id, showEditReviewModal]);

  function openReservationModal() {
    setShowReservationModal(true);
  }

  function closeReservationModal() {
    setShowReservationModal(false);
  }

  function openReviewForm() {
    setShowReviewForm(true);
  }
  function closeReviewForm() {
    setShowReviewForm(false);
    setShowEditReviewModal(false);
  }

  async function deleteReview(reviewId) {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione della recensione');
      }

      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Errore durante l\'eliminazione della recensione:', error);
    }
  }

  function editReview(reviewId) {
    setEditingReviewId(reviewId);
    setShowEditReviewModal(true);
  }


  function cancelEditReview() {
    setEditingReviewId(null);
    setShowEditReviewModal(false);
  }


  return (
    <div>
      {/* Sezione dati del ristorante */}
      <section className="restaurant-info">
        <h2>
          Ristorante: {selectedRestaurant.name}{' '}
        </h2>
        <button className="btn btn-primary" onClick={openReservationModal}>
          Prenota il tuo tavolo!.. ORA
        </button>
        <img src="" alt="FotoRistorante" />
        <p className='text-rest'>{selectedRestaurant.description}</p>
      </section>

      {/* Sezione recensioni */}
      <section className="reviews-section">
        <div className='"d-flex justify-content-between align-items-center"'>
          <h2>
            Recensioni
          </h2>
          <button className="btn btn-primary" onClick={openReviewForm}>
            Scrivi una recensione
          </button>
        </div>
        <div className="scrollbar" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {reviews
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordina le recensioni per data decrescente
            .map((review) => (
              <div key={review._id} className="card mb-3">
                <div className="card-body">
                  {showEditReviewModal && editingReviewId === review._id ? (
                    <div className="modal" style={{ display: 'block' }}>
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Modifica Recensione</h5>
                            <button type="button" className="btn-close" onClick={cancelEditReview}></button>
                          </div>
                          <div className="modal-body">
                            <EditReview
                              reviewId={editingReviewId}
                              currentText={reviews.find((r) => r._id === editingReviewId)?.text}
                              cancelEditReview={cancelEditReview}
                              closeReviewForm={closeReviewForm}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <p className='card-title'>
                        <strong>{review.userName} il {new Date(review.date).toLocaleDateString('it-IT')}<br /> Valutazione: {review.rating}/5</strong>
                      </p>
                      {review.user_Id === user._id && (
                        <div className="d-flex">
                          <button className="btn btn-primary" onClick={() => editReview(review._id)}>Modifica</button>
                          <button className="btn btn-danger me-2" onClick={() => deleteReview(review._id)}>Elimina</button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className='card-text'>{review.text}</p>
                </div>
              </div>
            ))}
        </div>

        {showReviewForm && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Scrivi una recensione</h5>
                  <button type="button" className="btn-close" onClick={closeReviewForm}></button>
                </div>
                <div className="modal-body">
                  <Review
                    selectedRestaurant={selectedRestaurant}
                    user={user}
                    closeReviewForm={closeReviewForm}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Sezione prenotazioni */}
      <section className="reservations-section">
        {showReservationModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Prenotazione</h5>
                  <button type="button" className="btn-close" onClick={closeReservationModal}></button>
                </div>
                <div className="modal-body">
                  <Reservation
                    selectedRestaurant={selectedRestaurant}
                    user={user}
                    setMyReservations={setMyReservations}
                    myReservations={myReservations}
                    closeReservationModal={closeReservationModal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}