import React, { useState, useEffect } from 'react';

function App() {
  const [city, setCity] = useState(""); // Pour stocker la ville
  const [weather, setWeather] = useState(null); // Pour stocker les infos météo actuelles
  const [forecast, setForecast] = useState(null); // Pour stocker les prévisions météo
  const [suggestions, setSuggestions] = useState([]); // Pour stocker les suggestions de villes

  const API_KEY = 'f9a79c5b3b624e5eb37844854647585c'; // Remplacez par votre clé API OpenCage
  const WEATHER_API_KEY = 'd6b86f21c72a4f7c9c0194553250404'; // Remplacez par votre clé API WeatherAPI ou OpenWeatherMap

  // Fonction pour récupérer les suggestions de villes
  async function getSuggestions(query) {
    if (query.length > 1) { // Démarrer après avoir tapé 2 caractères
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${API_KEY}&language=fr`);
      const data = await response.json();
      setSuggestions(data.results); // Stocker les résultats dans l'état
    }
  }

  // Fonction pour récupérer les informations météo actuelles et les prévisions sur plusieurs jours
  async function getWeather(cityName) {
    // Récupérer la météo actuelle
    const currentWeatherResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${cityName}&lang=fr`);
    const currentWeatherData = await currentWeatherResponse.json();

    // Récupérer la prévision sur 7 jours
    const forecastResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${cityName}&days=7&lang=fr`);
    const forecastData = await forecastResponse.json();

    if (currentWeatherData.error) {
      setWeather(null);
      setForecast(null);
    } else {
      setWeather(currentWeatherData);
      setForecast(forecastData.forecast.forecastday); // Stocke les prévisions sur 7 jours
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
                React Weather
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

              {/* Affichage des infos météo actuelles si disponibles */}
              {weather && (
                <div className="mt-4">
                  <h4>{weather.location.name}, {weather.location.country}</h4>
                  <p>🌡 Température actuelle : {weather.current.temp_c} °C</p>
                  <p>💧 Humidité : {weather.current.humidity} %</p>
                  <p>🌬 Vent : {weather.current.wind_kph} km/h</p>
                  <p>☁️ Conditions actuelles : {weather.current.condition.text}</p>
                </div>
              )}

              {/* Affichage des prévisions pour les 7 jours si disponibles */}
              {forecast && (
                <div className="mt-4">
                  <h5>Prévisions pour les 7 prochains jours</h5>
                  <div className="row">
                    {forecast.map((day, index) => (
                      <div key={index} className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>{new Date(day.date).toLocaleDateString()}</h6>
                            <p>🌡 Température : {day.day.avgtemp_c} °C</p>
                            <p>☁️ Conditions : {day.day.condition.text}</p>
                            <p>💧 Humidité : {day.day.avghumidity} %</p>
                            <p>🌬 Vent : {day.day.maxwind_kph} km/h</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
