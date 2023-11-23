import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('cliente');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    fetch('http://localhost:3000/register', {
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the success data (e.g., show success message)
        console.log('Registration successful:', data);
      })
      .catch(error => {
        // Handle errors (e.g., show error message)
        console.error('Error during registration:', error.message);
      });
  };

  return (
    <div className="background-container-register">
      <div className="container p-5">
        <h2 className="mb-4">Registrazione</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nome:</label>
            <input type="text" className="form-control" id="name" name="name" onChange={handleInputChange} />
          </div>
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

          <button type="button" className="btn btn-primary" onClick={handleRegister}>Registrati</button>
        </form>
        <p className="mt-3">Hai già un account? <Link to="/login">Accedi qui</Link></p>
      </div>
    </div>
  );
}
