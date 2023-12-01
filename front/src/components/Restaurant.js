import React, { useState, useEffect } from 'react';
import Reservation from './Reservation';
import Review from './Review';
import EditReview from './EditReview';

const Restaurant = ({ selectedRestaurant, user, setMyReservations, myReservations }) => {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);


  const closeReviewForm = () => {
    console.log('Chiamata a closeReviewForm');
    setShowReviewForm(false);
  };


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Recupera le recensioni dal backend per il ristorante corrente
        const response = await fetch(`http://localhost:3000/reviews/${selectedRestaurant._id}`);
        if (!response.ok) {
          throw new Error('Errore durante il recupero delle recensioni');
        }

        const fetchedReviews = await response.json();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Errore durante il recupero delle recensioni:', error);
        // Gestisci l'errore (ad esempio, mostra un messaggio all'utente)
      }
    };

    // Chiamata alla funzione per recuperare le recensioni quando il componente viene montato
    fetchReviews();
  }, [selectedRestaurant._id, closeReviewForm]);

  const openReservationModal = () => {
    setShowReservationModal(true);
  };

  const closeReservationModal = () => {
    setShowReservationModal(false);
  };

  const openReviewForm = () => {
    setShowReviewForm(true);
  };

  const deleteReview = async (reviewId) => {
    try {
      // Effettua una richiesta al backend per eliminare la recensione
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione della recensione');
      }

      // Rimuovi la recensione dall'array reviews
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Errore durante l\'eliminazione della recensione:', error);
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
    }
  };
  const editReview = (reviewId) => {
    setEditingReviewId(reviewId);
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
  };

  const handleEditReview = (reviewId, newText) => {
    // Aggiungi la logica per inviare la richiesta di modifica al backend
    console.log(`Modifica recensione ${reviewId} con il nuovo testo: ${newText}`);

    // Dopo la modifica, reimposta l'ID della recensione corrente a null
    cancelEditReview();
  };
  return (
    <div className="restaurant-container">
      {/* Sezione dati del ristorante */}

      <section className="restaurant-info">
        <h2>Ristorante: {selectedRestaurant.name} <button className="btn btn-primary" onClick={openReservationModal}>
          Prenota il tuo tavolo!.. ORA
        </button></h2>

        <img src="" alt="FotoRistorante" />
        <p className='text-rest'>{selectedRestaurant.description}</p>

      </section>

      {/* Sezione recensioni */}
      <section className="reviews-section">
        <h2>Recensioni <button className="btn btn-primary" onClick={openReviewForm}>
          Scrivi una recensione
        </button></h2>
        {/* Visualizza solo le recensioni relative al ristorante corrente */}
        {reviews.map((review) => (
          <div key={review._id}>
            {editingReviewId === review._id ? (

              <EditReview
                reviewId={review._id}
                currentText={review.text}
                onEditReview={handleEditReview}
                onCancelEdit={cancelEditReview}
              />


            ) : (
              <div>
                <p className='text-rest'>Recensione di: {review.userName} <br /> {review.text}</p>
                {review.user_Id === user._id && (
                  <div>
                    <button onClick={() => deleteReview(review._id)}>Elimina</button>
                    <button onClick={() => editReview(review._id)}>Modifica</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

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
                    reviews={reviews}
                    setReviews={setReviews}
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
};

export default Restaurant;
