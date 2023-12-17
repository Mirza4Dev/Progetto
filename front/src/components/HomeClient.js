import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Navbar, Container, Dropdown, Button, Form, FormControl, Card, Modal } from 'react-bootstrap'
import Details from './Details'
import EditReservation from './EditReservation'


export default function HomeClient() {
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [myReservations, setMyReservations] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReservationForEdit, setSelectedReservationForEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  useEffect(function () {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    setUser(storedUser)
  }, [])

  useEffect(() => {
    async function restaurants() {
      const res = await fetch('http://localhost:3000/restaurants')
      const data = await res.json()
      setRestaurants(data)
    }
    restaurants()
  }, [])

  useEffect(() => {
    async function userReservations() {
      const response = await fetch(`http://localhost:3000/reservations/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      setMyReservations(data)
    }
    if (user) {
      userReservations()
    }
  }, [user, showEditModal])

  const handleEditReservation = (reservation) => {
    setSelectedReservationForEdit(reservation)
    setShowEditModal(true)
  }

  async function handleDeleteReservation(reservationId) {
    const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      setMyReservations(myReservations.filter(reservation => reservation._id !== reservationId))
      alert('Prenotazione eliminata con successo!')
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="background-container-client">
      <Navbar className="container navbar navbar-expand-lg ">
        <Container>
          <Navbar.Brand href="/home-client" className="d-flex align-items-center ">
            <img src={require('../img/logo.png')} alt="Forketta Logo" width="69" className="d-inline-block me-1" />
            <h5 >In <br />Forketta <br />Mi</h5>
          </Navbar.Brand>
          <div className="navbar-collapse justify-content-center align-items-center" >
            <p className=" fw-bold fs-2"><strong>Benvenuto {user ? user.name : ''}</strong></p>

          </div>




          {/* Prenotazioni */}
          {user && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" >
                Le mie prenotazioni
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {myReservations.length === 0 ? (
                  <h4 className='text-center'>Non ci sono prenotazioni</h4>
                ) : (
                  <div className="scrollbar-dim-pren ms-1 me-1">
                    <h2 className="mb-2 text-center">Prenotazioni</h2>
                    <ul className="list-group overflow-auto ">
                      {myReservations
                        .sort((a, b) => new Date(a.day) - new Date(b.day))
                        .map((reservation) => (
                          <li key={reservation._id} className="list-group-item mb-2 d-flex flex-column">
                            <div>
                              <p className="mb-1"><strong>Ristorante:</strong> {reservation.name}</p>
                              <p className="mb-1 me-2"><strong>Giorno:</strong> {new Date(reservation.day).toLocaleDateString('it-IT')}</p>
                              <p className="mb-1"><strong>Ora:</strong> {reservation.time}</p>
                              <p><strong>Ospiti:</strong> {reservation.guests}</p>
                            </div>

                            <div className="mt-auto d-flex align-items-center">
                              <Button
                                variant="danger"
                                className="me-2"
                                onClick={() => handleDeleteReservation(reservation._id)}
                              >
                                Elimina
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => handleEditReservation(reservation)}
                              >
                                Modifica
                              </Button>
                            </div>
                          </li>
                        ))}
                    </ul>


                    {/* Componente EditReservation */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modifica prenotazione</Modal.Title>
                      </Modal.Header>
                      <Modal.Body >
                        <EditReservation reservation={selectedReservationForEdit} setShowEditModal={setShowEditModal} />
                      </Modal.Body>
                    </Modal>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Il Mio Profilo */}
          <Dropdown>
            <Dropdown.Toggle variant="primary" className="ms-4 me-3">
              Il Mio Profilo
            </Dropdown.Toggle>

            <Dropdown.Menu >
              {user ? (
                <>
                  <Dropdown.Item>
                    <Button variant="primary" className="ms-4" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item>
                    <Link to="/login" className="btn btn-primary ms-4">
                      Accedi
                    </Link>
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <Link to="/register" className="btn btn-primary ms-3">
                      Registrati
                    </Link>
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

        </Container>

      </Navbar>



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
            </Form>

            <div className="row row-cols-1 g-3 overflow-auto three-columns-grid">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="col mb-3">
                  <Card
                    className={`restaurant-card ${selectedRestaurant === restaurant ? 'selected' : 'hover'}`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <Card.Img className='imgCard' variant="top" src={restaurant.photos[0]} />
                    <Card.Body >
                      <Card.Title>{restaurant.name}</Card.Title>
                      <Card.Text>{restaurant.type}</Card.Text>
                      <Card.Text>{restaurant.position.city}</Card.Text>
                      <Card.Text>Prezzo medio {restaurant.price}€</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Componente Details */}
          <div className="col d-flex justify-content-center details" >
            {!selectedRestaurant && (
              <div className="text-center mt-5">
                <img src={require('../img/logo.png')} alt="Forketta Logo" width="100" className="d-inline-block align-top" />
                <p className="lead mt-3 text-white">InForketta il ristorante e goditi una bella mangiata</p>
              </div>
            )}
            {selectedRestaurant && (
              <div>
                <Details selectedRestaurant={selectedRestaurant} user={user} setMyReservations={setMyReservations} myReservations={myReservations} />
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}
