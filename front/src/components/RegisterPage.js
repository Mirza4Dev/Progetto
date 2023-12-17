import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [selectedCategory, setSelectedCategory] = useState('cliente')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData(() => ({
      ...formData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRegister = async () => {
    console.log('Contenuto di formData:', formData)
    if (!formData.name || !formData.email || !formData.password) {
      alert('Compila tutti i campi')
      return
    }

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        category: selectedCategory,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      alert(`${data.error}`)
      return
    }

    let email = formData.email
    let password = formData.password


    let res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        selectedCategory
      }),
    })


    const { token, user } = await res.json()

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    if (user.category === 'cliente') {
      navigate('/home-client')
    } else if (user.category === 'ristoratore') {
      navigate('/home-restaurant')
    }
  }



  return (
    <Container fluid className="background-container-register">
      <Container className="p-5">
        <h2 className="mb-4">Registrazione</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome:</Form.Label>
            <Form.Control type="text" name="name" placeholder="Inserisci il nome" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" name="email" placeholder="inserisci una email" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" name="password" placeholder="Inserisci una password" onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Switch
              type="radio"
              label="Cliente"
              checked={selectedCategory === 'cliente'}
              onChange={() => setSelectedCategory('cliente')}
            />
            <Form.Switch
              type="radio"
              label="Ristoratore"
              checked={selectedCategory === 'ristoratore'}
              onChange={() => setSelectedCategory('ristoratore')}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleRegister}>
            Registrati
          </Button>
        </Form>

        <p className="mt-3">
          Hai già un account? <Link to="/login">Accedi qui</Link>
        </p>
      </Container>
    </Container>
  )
}
