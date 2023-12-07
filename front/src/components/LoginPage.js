import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cliente');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleLogin() {
    try {
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

      // Salva il token e le informazioni sull'utente nel localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Esegui il reindirizzamento in base alla categoria
      if (user.category === 'cliente') {
        navigate('/home-client');
      } else if (user.category === 'ristoratore') {
        navigate('/home-restaurant');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setError('Errore durante il login');
    }
  }

  return (
    <div className="background-container-login">
      <div className="container p-5">
        <h2 className="mb-4">Accesso</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <div className="btn-group" >
              <input type="radio" className="btn-check" id="clienteRadio" checked={selectedCategory === 'cliente'} onChange={() => setSelectedCategory('cliente')} />
              <label className="btn btn-outline-primary" htmlFor="clienteRadio">Cliente</label>

              <input type="radio" className="btn-check" id="ristoratoreRadio" checked={selectedCategory === 'ristoratore'} onChange={() => setSelectedCategory('ristoratore')} />
              <label className="btn btn-outline-primary" htmlFor="ristoratoreRadio">Ristoratore</label>
            </div>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleLogin}>Accedi</button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
        <p className="mt-3">Non hai ancora un account? <Link to="/register">Registrati qui</Link></p>
      </div>
    </div>
  );
}
