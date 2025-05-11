import React, { useState, useEffect } from 'react';

function App() {
  const [city, setCity] = useState(""); // Pour stocker la ville
  const [weather, setWeather] = useState(null); // Pour stocker les infos météo
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // Pour stocker les suggestions de villes

  const API_KEY = 'f9a79c5b3b624e5eb37844854647585c'; // Remplacez par votre clé API OpenCage
  const WEATHER_API_KEY = 'd6b86f21c72a4f7c9c0194553250404'; // Remplacez par votre clé API pour la météo (WeatherAPI ou autre)

  // Fonction pour récupérer les suggestions de villes
  async function getSuggestions(query) {
    if (query.length > 1) { // Démarrer après avoir tapé 2 caractères
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${API_KEY}&language=fr`);
      const data = await response.json();
      setSuggestions(data.results); // Stocker les résultats dans l'état
    }
  }

  // Fonction pour récupérer les informations météo
  async function getWeather(cityName) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${cityName}&lang=fr`);
    const data = await response.json();
    if (data.error) {
      setWeather(null);
    } else {
      setWeather(data);
    }
  }

  // Mettre à jour la ville et gérer les suggestions
  const handleChange = (event) => {
    const value = event.target.value;
    setCity(value);
    getSuggestions(value); // Appeler la fonction pour récupérer les suggestions
  };

  // Sélectionner une suggestion et récupérer la météo
  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    getWeather(selectedCity); // Récupérer la météo pour la ville sélectionnée
    setSuggestions([]); // Effacer les suggestions
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-6 mx-auto">
          <div className="card bg-white text-dark">
            <div className="card-header">
              <h3 className="card-title mt-2 text-center">
              🌤️  React Weather
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="city" 
                      id="adress-input" 
                      className="form-control"
                      placeholder="Entrer une ville"
                      value={city}
                      onChange={handleChange} // Gérer le changement du champ de saisie
                    />
                    <ul className="list-group mt-2">
                      {suggestions.length > 0 && 
                        suggestions.map((suggestion, index) => (
                          <li 
                            key={index} 
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelectCity(suggestion.formatted)} // Cliquer sur une suggestion
                          >
                            {suggestion.formatted}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>

              {/* Affichage des infos météo si disponibles */}
              {weather && (
                <div className="mt-4">
                  <h4>{weather.location.name}, {weather.location.country}</h4>
                  <p>🌡 Température : {weather.current.temp_c} °C</p>
                  <p>💧 Humidité : {weather.current.humidity} %</p>
                  <p>🌬 Vent : {weather.current.wind_kph} km/h</p>
                  <p>☁️ Conditions : {weather.current.condition.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
