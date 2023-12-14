import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('cliente');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate()

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Compila tutti i campi');
      return;
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
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Registrazione avvenuta con successo:', data);
      setRegistrationSuccess(true);

    }
  };
  useEffect(() => {
    if (registrationSuccess) {
      const timeoutId = setTimeout(() => {
        setRegistrationSuccess(false);
        navigate('/login');
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [registrationSuccess, navigate]);


  return (
    <Container fluid className="background-container-register">
      <Container className="p-5">
        <h2 className="mb-4">Registrazione</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome:</Form.Label>
            <Form.Control type="text" id="name" name="name" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" id="email" name="email" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" id="password" name="password" onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Switch
              type="radio"
              id="clienteRadio"
              label="Cliente"
              checked={selectedCategory === 'cliente'}
              onChange={() => handleCategoryChange('cliente')}
            />
            <Form.Switch
              type="radio"
              id="ristoratoreRadio"
              label="Ristoratore"
              checked={selectedCategory === 'ristoratore'}
              onChange={() => handleCategoryChange('ristoratore')}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleRegister}>
            Registrati
          </Button>

          {registrationSuccess && (
            <Alert variant="success" className="mt-3">
              Registrazione avvenuta con successo! Verrai reindirizzato alla pagina di login.
            </Alert>
          )}
        </Form>

        <p className="mt-3">
          Hai già un account? <Link to="/login">Accedi qui</Link>
        </p>
      </Container>
    </Container>
  );
}
