import React, { useState, useEffect } from 'react';

export default function HomeClient() {
  const [restaurants, setRestaurants] = useState([]);

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/restaurants');
  //       if (response.ok) {
  //         const restaurantsData = await response.json();
  //         setRestaurants(restaurantsData);
  //       } else {
  //         console.error('Errore durante il recupero dei ristoranti');
  //       }
  //     } catch (error) {
  //       console.error('Errore durante la richiesta di recupero dei ristoranti:', error);
  //     }
  //   };

  //   fetchRestaurants();
  // }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Visualizzazione dei Ristoranti</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
}
