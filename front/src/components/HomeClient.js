import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Restaurant from './Restaurant';
import { NavDropdown } from 'react-bootstrap';
import EditReservation from './EditReservation';


export default function HomeClient() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservationForEdit, setSelectedReservationForEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);


  useEffect(() => {
    async function fetchRestaurants() {
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
    }

    fetchRestaurants();
  }, []);

  useEffect(() => {
    async function fetchUserReservations() {
      const response = await fetch(`http://localhost:3000/reservations/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMyReservations(data);

    }

    if (user) {
      fetchUserReservations();
    }
  }, [user, showEditModal]);

  function handleRestaurantSelection(restaurant) {
    setSelectedRestaurant(restaurant);
  }

  const handleEditReservation = (reservation) => {
    setSelectedReservationForEdit(reservation);
    setShowEditModal(true);
  };


  async function handleDeleteReservation(reservationId) {
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
  }




  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="background-container-client">
      <nav className="container mt-4 navbar navbar-expand-lg">
        <a className="navbar-brand d-flex align-items-center ms-3" href="/home-client">
          <img src={require('../img/logo.png')} alt="Forketta Logo" width="60" className="d-inline-block align-top" />
          <span className="ms-2">Forketta</span>
        </a>

        <div className="collapse navbar-collapse justify-content-center align-items-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item text-center">
              <p className="nav-link fw-bold fs-4">Benvenuto {user ? user.name : ''}</p>
            </li>
          </ul>
        </div>


        <NavDropdown title="Le mie prenotazioni" id="basic-nav-dropdown">
          <NavDropdown.ItemText>
            <h2 className="mb-4">Prenotazioni</h2>
            <ul className="list-group overflow-auto">
              {myReservations
                .sort((a, b) => new Date(a.day) - new Date(b.day))
                .map((reservation) => (
                  <li key={reservation._id} className="list-group-item mb-3 d-flex flex-column">
                    <div>
                      <p className="mb-1"><strong>Ristorante:</strong> {reservation.name}</p>
                      <p className="mb-1 me-2"><strong>Giorno:</strong> {reservation.day}</p>
                      <p className="mb-1"><strong>Ora:</strong> {reservation.time}</p>
                      <p><strong>Ospiti:</strong> {reservation.guests}</p>
                    </div>
                    <div className="mt-auto d-flex align-items-center">
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDeleteReservation(reservation._id)}
                      >
                        Elimina
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        Modifica
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </NavDropdown.ItemText>
        </NavDropdown>






        <ul className="navbar-nav" style={{ marginRight: '15px' }}>
          <li className="nav-item">
            <a className="nav-link" href="/profile">Il Mio Profilo</a>
          </li>
          <li className="nav-item ml-2">
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>


      <div className="container mt-4">
        <div className="row main">
          {/* Visualizzazione dei Ristoranti */}
          <div className="col-md-6">
            <h2 className="mb-2">Scegli il Ristorante da inForkettare</h2>
            <form className="form-inline d-flex align-items-center mb-4 me-3">
              <input className="form-control mr-sm-2" type="search" placeholder="Cerca" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Cerca</button>
            </form>

            <div className="row row-cols-1 row-cols-md-3 g-3 overflow-auto" style={{ maxHeight: "500px" }}>
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="col mb-3">
                  <div
                    className="card h-100 restaurant-card hover"
                    onClick={() => handleRestaurantSelection(restaurant)}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text">{restaurant.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sezione per la visualizzazione del Restaurant */}
          <div className="col d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${require('../img/nero.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '30px', borderRadius: '50px', marginTop: '50px', marginRight: '30px' }}>
            {!selectedRestaurant && (
              <div className="text-center">
                <p className="text-center lead mt-3 text-white" >InForketta il ristorante e goditi una bella mangiata</p>
              </div>
            )}
            {selectedRestaurant && (

              <div >
                <Restaurant selectedRestaurant={selectedRestaurant}
                  user={user}
                  setMyReservations={setMyReservations} myReservations={myReservations}
                />
              </div>
            )}
          </div>

        </div>

      </div>







      {showEditModal && (
        <EditReservation
          reservation={selectedReservationForEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

    </div>
  );
};
