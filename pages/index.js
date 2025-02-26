import React, { useState, useEffect } from "react";
import WeatherCard from "../components/WeatherCard";
import axios from "axios";

const fetchCitySuggestions = async (query) => {
    const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    return response.data;
};

export default function Home() {
    const [ city, setCity ] = useState("");
    const [ cities, setCities ] = useState([ "Bengaluru", "Rawalpindi", "Delhi", "Los Angeles", "Chennai" ]);
    const [ suggestions, setSuggestions ] = useState([]);
    const [ isDarkMode, setIsDarkMode ] = useState(false);
    const [ globalTime, setGlobalTime ] = useState(Date.now());

    const handleCityChange = async (e) => {
        const value = e.target.value;
        setCity(value);
        if (value.length > 2) {
            const results = await fetchCitySuggestions(value);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const interval = setInterval(() => setGlobalTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAddCity = (selectedCity) => {
        if (selectedCity && !cities.includes(selectedCity)) {
            setCities([ ...cities, selectedCity ]);
            setCity("");
            setSuggestions([]);
        }
    };

    const removeCity = (cityToRemove) => {
        setCities(cities.filter((c) => c !== cityToRemove));
    };

    return (
        <div
            className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
                } transition-colors duration-300`}
        >
            <h1 className="text-3xl font-bold text-center mb-6">Weather Dashboard</h1>
            <div className="flex justify-center mb-6 relative">
                <div className="relative">
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="Enter city name"
                        className={`p-2 border rounded-l-md focus:outline-none focus:ring-2 w-64 ${isDarkMode
                            ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-400"
                            : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
                            }`}
                    />
                    {suggestions.length > 0 && (
                        <ul
                            className={`absolute left-0 top-full bg-${isDarkMode ? "gray-800" : "white"
                                } border rounded-md w-full max-h-40 overflow-auto z-10 shadow-lg`}
                        >
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.name}
                                    className={`p-2 hover:bg-${isDarkMode ? "gray-700" : "gray-100"
                                        } cursor-pointer`}
                                    onClick={() => handleAddCity(suggestion.name)}
                                >
                                    {suggestion.name}, {suggestion.country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    onClick={handleAddCity}
                    className={`bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 ${isDarkMode ? "hover:bg-blue-400" : ""
                        }`}
                >
                    Add City
                </button>
                <button
                    onClick={toggleTheme}
                    className={`ml-4 p-2 rounded-md ${isDarkMode
                        ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {cities.map((city) => (
                    <WeatherCard
                        key={city}
                        city={city}
                        removeCity={removeCity}
                        globalTime={globalTime}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </div>
        </div>
    );
}