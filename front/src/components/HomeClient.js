import React, { useState, useEffect } from 'react';
import Reservation from './Reservation';
import { useNavigate } from 'react-router-dom';

const HomeClient = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);


  useEffect(() => {
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
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/user/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Errore nella fetch delle prenotazioni dell\'utente');
        }

        const data = await response.json();
        setMyReservations(data);
      } catch (error) {
        console.error('Errore durante la fetch delle prenotazioni dell\'utente:', error);
      }
    };

    if (user) {
      fetchUserReservations();
    }
  }, [user]);




  const handleRestaurantSelection = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleDeleteReservation = async (reservationId) => {
    console.log('reservationId:', reservationId);

    const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      setMyReservations(myReservations.filter(reservation => reservation._id !== reservationId));

      alert('Prenotazione eliminata con successo!');
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                  className="list-group-item restaurant-item"
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
                  {`Ristorante: ${reservation.name}, Giorno: ${reservation.day}, Ora: ${reservation.time}`}
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDeleteReservation(reservation._id)}
                  >
                    Elimina
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sezione per la visualizzazione della prenotazione selezionata */}
        {selectedRestaurant && (
          <div>
            <Reservation selectedRestaurant={selectedRestaurant} user={user} setMyReservations={setMyReservations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeClient;