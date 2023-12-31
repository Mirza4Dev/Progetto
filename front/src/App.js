import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HomeClient from './components/HomeClient';
import HomeRestaurant from './components/HomeRestaurant';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home-client" element={<HomeClient />} />
        <Route path="/home-restaurant" element={<HomeRestaurant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
