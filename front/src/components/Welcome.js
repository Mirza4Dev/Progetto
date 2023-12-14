// Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="background-container-welcome">
      <div className="container p-5">
        <h2 className="mb-4">Benvenuto!</h2>
        <p>Preparati per un esperienza mistica</p>

        <div className="d-flex flex-column">
          <Link to="/login" className="btn btn-primary mb-2">Accedi</Link>
          <Link to="/register" className="btn btn-secondary">Registrati</Link>
        </div>
      </div>
    </div>

  );
}
