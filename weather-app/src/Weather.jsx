import React, { useState, useEffect } from 'react';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'd6b86f21c72a4f7c9c0194553250404'; // Ta clé API

  // Requête API météo à chaque fois que la ville change
  useEffect(() => {
    if (city.length > 2) {
      fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&lang=fr`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setWeather(null);
            setError(data.error.message);
          } else {
            setWeather(data);
            setError('');
          }
        })
        .catch(() => {
          setWeather(null);
          setError('Erreur de connexion');
        });
    }
  }, [city]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🌤️ Application Météo</h2>
      <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Entrez une ville"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button className="btn btn-primary w-100 mb-3" onClick={() => setCity(cityInput)}>
          Rechercher
        </button>

        {error && <div className="alert alert-danger">{error}</div>}

        {weather && (
          <div className="text-center">
            <h4>{weather.location.name}, {weather.location.country}</h4>
            <p>🌡 Température : {weather.current.temp_c} °C</p>
            <p>💧 Humidité : {weather.current.humidity} %</p>
            <p>🌬 Vent : {weather.current.wind_kph} km/h</p>
            <p>☁️ Conditions : {weather.current.condition.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
