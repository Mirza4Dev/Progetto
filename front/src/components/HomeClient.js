import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, NavDropdown, Form, FormControl, Button, Card, Modal } from 'react-bootstrap';
import Restaurant from './Restaurant';
import EditReservation from './EditReservation';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomeClient() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservationForEdit, setSelectedReservationForEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    async function fetchRestaurants() {
      const response = await fetch('http://localhost:3000/restaurants');
      const data = await response.json();
      setRestaurants(data);
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

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="background-container-client">
      <Nav className="container navbar navbar-expand-lg ">

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
          <NavDropdown.ItemText className="dropdown-menu-scrollable">
            <h2 className="mb-4">Prenotazioni</h2>
            <ul className="list-group overflow-auto">
              {myReservations
                .sort((a, b) => new Date(a.day) - new Date(b.day))
                .map((reservation) => (
                  <li key={reservation._id} className="list-group-item mb-3 d-flex flex-column">
                    <div>
                      <p className="mb-1"><strong>Ristorante:</strong> {reservation.name}</p>
                      <p className="mb-1 me-2"><strong>Giorno:</strong> {formatDate(reservation.day)}</p>
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
      </Nav>

      <div className="container mt-3 ">
        <div className="row main ">
          {/* Visualizzazione dei Ristoranti */}
          <div className="col-md-6">
            <h2 className="mb-2">Scegli il Ristorante da inForkettare</h2>
            <Form className="form-inline d-flex align-items-center mb-4 me-3">
              <FormControl
                type="search"
                placeholder="Cerca"
                className="mr-sm-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-success" type="submit">
                Cerca
              </Button>
            </Form>

            <div className="row row-cols-1 g-3 overflow-auto three-columns-grid" style={{ maxHeight: "500px" }}>
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="col mb-3">
                  <Card className={`restaurant-card ${selectedRestaurant === restaurant ? 'selected' : 'hover'}`} onClick={() => setSelectedRestaurant(restaurant)}>
                    <Card.Img className='imgCard' variant="top" src={restaurant.photos[0]} />
                    <Card.Body >
                      <Card.Title>{restaurant.name}</Card.Title>
                      <Card.Text>{restaurant.type}</Card.Text>
                      <Card.Text>{restaurant.position.city}</Card.Text>
                      <Card.Text>Prezzo medio: ${restaurant.price}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

          </div>

          {/* Sezione per la visualizzazione del Restaurant */}
          <div className="col d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${require('../img/nero.jpg')})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '30px', borderRadius: '10px', marginTop: '50px', marginRight: '30px' }}>
            {!selectedRestaurant && (
              <div className="text-center">
                <p className="text-center lead mt-3 text-white">InForketta il ristorante e goditi una bella mangiata</p>
              </div>
            )}
            {selectedRestaurant && (
              <div>
                <Restaurant selectedRestaurant={selectedRestaurant} user={user} setMyReservations={setMyReservations} myReservations={myReservations} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditReservation reservation={selectedReservationForEdit} setShowEditModal={setShowEditModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
