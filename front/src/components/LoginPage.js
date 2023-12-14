import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cliente');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleLogin() {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, selectedCategory }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message);
      return;
    }

    const { token, user } = await response.json();

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if (user.category === 'cliente') {
      navigate('/home-client');
    } else if (user.category === 'ristoratore') {
      navigate('/home-restaurant');
    }
  }

  return (
    <Container fluid className="background-container-login">
      <Container className="p-5">
        <h2 className="mb-4">Accesso</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Switch
              type="radio"
              id="clienteRadio"
              label="Cliente"
              checked={selectedCategory === 'cliente'}
              onChange={() => setSelectedCategory('cliente')}
            />
            <Form.Switch
              type="radio"
              id="ristoratoreRadio"
              label="Ristoratore"
              checked={selectedCategory === 'ristoratore'}
              onChange={() => setSelectedCategory('ristoratore')}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleLogin}>
            Accedi
          </Button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>

        <p className="mt-3">
          Non hai ancora un account? <Link to="/register">Registrati qui</Link>
        </p>
      </Container>
    </Container>
  );
}
