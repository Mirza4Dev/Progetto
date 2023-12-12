import React, { useState, useEffect } from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';
import Reservation from './Reservation';
import Review from './Review';
import EditReview from './EditReview';

export default function Restaurant({ selectedRestaurant, user, setMyReservations, myReservations }) {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  useEffect(function () {
    async function fetchReviews() {
      const response = await fetch(`http://localhost:3000/reviews/${selectedRestaurant._id}`);

      const fetchedReviews = await response.json();
      setReviews(fetchedReviews);
    }
    fetchReviews();
  }, [selectedRestaurant._id, showEditReviewModal, showReviewForm]);

  function closeReviewForm() {
    setShowReviewForm(false);
    setShowEditReviewModal(false);
  }

  async function deleteReview(reviewId) {
    await fetch(`http://localhost:3000/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    setReviews(reviews.filter((review) => review._id !== reviewId));

  }

  function editReview(reviewId) {
    setEditingReviewId(reviewId);
    setShowEditReviewModal(true);
  }


  function cancelEditReview() {
    setEditingReviewId(null);
    setShowEditReviewModal(false);
  }

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % selectedRestaurant.photos.length;
    setCurrentImageIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentImageIndex - 1 + selectedRestaurant.photos.length) % selectedRestaurant.photos.length;
    setCurrentImageIndex(prevIndex);
  };

  function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }

  return (
    <div>
      {/* Sezione dati del ristorante */}
      <section className="restaurant-info container mt-4">
        <div className="row">
          <div className="col-md-6">
            <Carousel id="restaurantImageCarousel" interval={null} prevLabel="Previous" nextLabel="Next">
              {selectedRestaurant.photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img src={photo} className="d-block w-100" alt="foto ristorante" />
                </Carousel.Item>
              ))}
            </Carousel>
            <span>Cucina {selectedRestaurant.type}</span> <br />
            <span>{selectedRestaurant.position.cap} - {selectedRestaurant.position.city} - {selectedRestaurant.position.street}</span>
          </div>
          <div className="col-md-6 d-flex flex-column">
            <h2 className="text-center">{selectedRestaurant.name}</h2>
            <Button variant="primary" className="mb-3" onClick={() => setShowReservationModal(true)}>
              Prenota il tuo tavolo!.. ORA
            </Button>
            <p>{selectedRestaurant.description}</p>
          </div>
        </div>
      </section>

      {/* Sezione recensioni */}
      <section className="reviews-section container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex  align-items-center mb-3">
              <div className='d-flex align-items-center '>
                <h2 className='ms-3'>Recensioni</h2>
                <span className='ms-4'> {calculateAverageRating(reviews).toFixed(1)}/5</span>
              </div>
              <Button variant="primary" className="ms-auto" onClick={() => setShowReviewForm(true)}>
                Scrivi una recensione
              </Button>
            </div>
            <div className="scrollbar-review" >
              {reviews
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((review) => (
                  <div key={review._id} className="card mb-3">
                    <div className="card-body">
                      {showEditReviewModal && editingReviewId === review._id ? (
                        <Modal show={showEditReviewModal} onHide={cancelEditReview} size="lg">
                          <Modal.Header closeButton>
                            <Modal.Title>Modifica Recensione</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <EditReview
                              reviewId={editingReviewId}
                              currentText={reviews.find((r) => r._id === editingReviewId)?.text}
                              cancelEditReview={cancelEditReview}
                              setShowEditReviewModal={setShowEditReviewModal}
                            />
                          </Modal.Body>
                        </Modal>
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
              <Modal show={showReviewForm} onHide={closeReviewForm} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Scrivi una recensione</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Review
                    selectedRestaurant={selectedRestaurant}
                    user={user}
                    closeReviewForm={closeReviewForm}
                  />
                </Modal.Body>
              </Modal>
            )}

          </div>
        </div>
      </section >

      {/* Sezione prenotazioni */}
      <section className="reservations-section">
        {showReservationModal && (
          <Modal show={showReservationModal} onHide={() => setShowReservationModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Prenotazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Reservation
                selectedRestaurant={selectedRestaurant}
                user={user}
                setMyReservations={setMyReservations}
                myReservations={myReservations}
                setShowReservationModal={() => setShowReservationModal(false)}
              />
            </Modal.Body>
          </Modal>
        )}
      </section>
    </div>
  );
}