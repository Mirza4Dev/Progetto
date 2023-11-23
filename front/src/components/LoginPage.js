import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('cliente');
  const navigate = useNavigate(); // Hook di React Router per la navigazione
  const [error, setError] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // LoginPage.jsx

  const handleLogin = async () => {
    try {
      // Simulazione di una richiesta al server per ottenere la lista degli utenti
      const usersResponse = await fetch('http://localhost:3000/users');

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const authenticatedUser = users.find(user => user.email === loginData.email && user.password === loginData.password && user.category === selectedCategory);

        if (authenticatedUser) {
          if (authenticatedUser.category === 'cliente') {
            navigate('/home-client', { state: { user: authenticatedUser } });
          } else if (authenticatedUser.category === 'ristoratore') {
            navigate('/home-restaurant', { state: { user: authenticatedUser } });
          }
        } else {
          setError('Credenziali non valide o categoria non corrispondente');
        }
      } else {
        const errorData = await usersResponse.json();
        setError(errorData.error || 'Errore durante l\'accesso');
      }
    } catch (error) {
      console.error('Errore durante la richiesta di accesso:', error);
      setError('Errore durante la richiesta di accesso');
    }
  };


  return (
    <div className="background-container-login">
      <div className="container p-5">
        <h2 className="mb-4">Accesso</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" className="form-control" id="email" name="email" onChange={handleInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" className="form-control" id="password" name="password" onChange={handleInputChange} />
          </div>

          <div className="mb-3">
            <div className="btn-group" role="group">
              <input type="radio" className="btn-check" id="clienteRadio" autoComplete="off" checked={selectedCategory === 'cliente'} onChange={() => handleCategoryChange('cliente')} />
              <label className="btn btn-outline-primary" htmlFor="clienteRadio">Cliente</label>

              <input type="radio" className="btn-check" id="ristoratoreRadio" autoComplete="off" checked={selectedCategory === 'ristoratore'} onChange={() => handleCategoryChange('ristoratore')} />
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
