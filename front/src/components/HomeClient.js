import React, { useState, useEffect } from 'react';
import Reservation from './Reservation';
import { useNavigate } from 'react-router-dom';

const HomeClient = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [myReservations, setMyReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera le informazioni sull'utente dal localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    // Effetto per la fetch dei ristoranti
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:3000/restaurants');
        if (!response.ok) {
          throw new Error('Errore nella fetch dei ristoranti');
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Errore durante la fetch dei ristoranti:', error);
        // Gestisci l'errore in base alle tue esigenze
      }
    };

    // Chiamata alla funzione per la fetch dei ristoranti
    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Effetto per la fetch delle prenotazioni dell'utente
    const fetchUserReservations = async () => {
      try {
        const response = await fetch('http://localhost:3000/reservations');
        if (!response.ok) {
          throw new Error('Errore nella fetch delle prenotazioni utente');
        }

        const data = await response.json();
        setMyReservations(data);
      } catch (error) {
        console.error('Errore durante la fetch delle prenotazioni utente:', error);
        // Gestisci l'errore in base alle tue esigenze
      }
    };

    // Chiamata alla funzione per la fetch delle prenotazioni utente
    fetchUserReservations();
  }, [user]); // Riesegui l'effetto quando cambia l'utente


  const handleRestaurantSelection = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };


  const handleReservationSubmit = async (reservationData) => {
    try {
      // Effettua la richiesta POST al tuo endpoint di prenotazione
      const response = await fetch(`http://localhost:3000/api/restaurants/${selectedRestaurant._id}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assicurati di includere il token nel caso di autenticazione
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error('Errore durante la prenotazione');
      }

      // Aggiorna la lista delle prenotazioni dell'utente con la nuova prenotazione
      const newReservation = await response.json();
      setMyReservations([...myReservations, newReservation]);

      // Chiudi la finestra di prenotazione dopo una prenotazione riuscita
      setShowReservationForm(false);

    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      // Gestisci l'errore in base alle tue esigenze
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };


  return (
    <div className="background-container-login">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light" >
        <a className="navbar-brand" href="/">
          <img src="/Progetto/front/src/img/logo.png" alt="Forketta Logo" width="30" height="30" className="d-inline-block align-top" />
          Forketta
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <p className="nav-link">Benvenuto {user ? user.name : ''}</p>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">Il Mio Profilo</a>
            </li>
            <li className="nav-item ml-2">
              <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenuto principale */}
      <div className="container mt-5">
        <div className="row">
          {/* Visualizzazione dei Ristoranti */}
          <div className="col-md-6">
            <h2 className="mb-4">Scegli il Ristorante</h2>
            <ul className="list-group">
              {restaurants.map((restaurant) => (
                <li
                  key={restaurant._id}
                  className="list-group-item"
                  onClick={() => handleRestaurantSelection(restaurant)}
                >
                  {restaurant.name}
                </li>
              ))}
            </ul>
          </div>
          {/* Sezione per la visualizzazione delle prenotazioni utente */}
          <div className="col-md-6">
            <h2 className="mb-4">Le mie prenotazioni</h2>
            <ul className="list-group">
              {myReservations.map((reservation) => (
                <li key={reservation._id} className="list-group-item">
                  Ristorante: {reservation.name}, Giorno: {reservation.day}, Ora: {reservation.time}, Ospiti: {reservation.guests}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sezione per la visualizzazione della prenotazione selezionata */}
        {selectedRestaurant && (
          <div>
            <Reservation selectedRestaurant={selectedRestaurant} user={user} />
            {/* Mostra la finestra di prenotazione solo se showReservationForm è true */}
            {showReservationForm && (
              <Reservation
                onReservationSubmit={handleReservationSubmit}
                restaurantId={selectedRestaurant?._id}
                user={user}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeClient;
