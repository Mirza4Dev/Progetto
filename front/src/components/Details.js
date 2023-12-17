import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Carousel } from 'react-bootstrap'
import Reservation from './Reservation'
import Review from './Review'
import EditReview from './EditReview'

export default function Details({ selectedRestaurant, user, setMyReservations, myReservations }) {
  const navigate = useNavigate()
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showEditReviewModal, setShowEditReviewModal] = useState(false)
  const [reviews, setReviews] = useState([])
  const [editingReviewId, setEditingReviewId] = useState(null)

  const editingReview = reviews.find((r) => r._id === editingReviewId);
  const currentText = editingReview ? editingReview.text : "";

  useEffect(() => {
    async function fetchRestaurantReviews() {
      const res = await fetch(`http://localhost:3000/reviews/${selectedRestaurant._id}`)
      const fetchedReviews = await res.json()
      setReviews(fetchedReviews)
    }
    fetchRestaurantReviews()
  }, [selectedRestaurant, showEditReviewModal, showReviewForm])


  async function deleteReview(reviewId) {
    let res = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      console.log('Errore durante l\'eliminazione della recensione')
    }
    setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId))
    alert('Recensione eliminata')
  }

  function hanldeEditReview(reviewId) {
    setEditingReviewId(reviewId)
    setShowEditReviewModal(true)
  }

  function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
      return 0
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    return totalRating / reviews.length
  }

  return (
    <div>
      {/* Sezione dati del ristorante */}
      <section className="restaurant-info container">
        <div className="row">
          <div className="col-md-6">
            <Carousel interval={null} >
              {selectedRestaurant.photos.map((photo) => (
                <Carousel.Item >
                  <img src={photo} className="d-block imgsRest" alt="foto ristorante" />
                </Carousel.Item>
              ))}
            </Carousel>
            <span>Cucina {selectedRestaurant.type}</span> <br />
            <span>{selectedRestaurant.position.city} - {selectedRestaurant.position.street}</span>
          </div>

          <div className="col-md-6 d-flex flex-column">
            <h2 className="text-center">{selectedRestaurant.name}</h2>

            {user ? (
              <Button variant="primary" className="mb-3" onClick={() => setShowReservationModal(true)}>
                Prenota il tuo tavolo!.. ORA
              </Button>
            ) : (
              <Button variant="primary" className="mb-3" onClick={() => navigate('/login')}>
                Accedi per poter prenotare
              </Button>
            )}
            <p className="scrollbar-dim">{selectedRestaurant.description}</p>
          </div>
        </div>
      </section>

      {/* Sezione prenotazioni quando clicco su prenota */}
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

      {/* Sezione recensioni */}
      <section className="reviews-section container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex  align-items-center mb-3">
              <div className='d-flex align-items-center '>
                <h2 className='ms-3'>Recensioni</h2>
                <span className='ms-4'> {calculateAverageRating(reviews).toFixed(1)}/5</span>
              </div>

              {user && (
                <Button variant="primary" className="ms-auto" onClick={() => setShowReviewForm(true)}>
                  Scrivi una recensione
                </Button>
              )}
            </div>
            {reviews.length === 0 ? (
              <h4 className='text-center'>Scrivi la prima recensione</h4>
            ) : (
              <div className="scrollbar-dim">
                {reviews
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((review) => (
                    <div className="card mb-3">

                      <div className="card-body">

                        {user && showEditReviewModal && editingReviewId === review._id ? (
                          <Modal show={() => setShowEditReviewModal(true)} onHide={() => setShowEditReviewModal(false)} size="lg">
                            <Modal.Header closeButton>
                              <Modal.Title>Modifica Recensione</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <EditReview
                                reviewId={editingReviewId}
                                currentText={currentText}
                                setEditingReviewId={setEditingReviewId}
                                setShowEditReviewModal={setShowEditReviewModal}
                              />
                            </Modal.Body>
                          </Modal>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <p className='card-title'>
                              <strong>{review.userName} il {new Date(review.date).toLocaleDateString('it-IT')}<br /> Valutazione: {review.rating}/5</strong>
                            </p>
                            {user && review.user_Id === user._id && (
                              <div className="d-flex">
                                <Button variant="primary" onClick={() => hanldeEditReview(review._id)}>
                                  Modifica
                                </Button>
                                <Button variant="danger" className="me-1 ms-2" onClick={() => deleteReview(review._id)}>
                                  Elimina
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        <p className='card-text'>{review.text}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {user && (
              <Modal show={showReviewForm} onHide={() => setShowReviewForm(false)} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Scrivi una recensione</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Review
                    selectedRestaurant={selectedRestaurant}
                    user={user}
                    setShowReviewForm={setShowReviewForm}
                  />
                </Modal.Body>
              </Modal>
            )}

          </div>
        </div>
      </section >


    </div>
  )
}