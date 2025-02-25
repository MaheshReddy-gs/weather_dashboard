import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloud,
    faSun,
    faBolt,
    faSnowflake,
    faSmog,
    faCloudRain,
} from "@fortawesome/free-solid-svg-icons";

const fetchWeather = async (city) => {
    const response = await axios.get(`/api/weather?city=${city}`);
    return response.data;
};

const getLocalTime = (timezoneOffset, baseTime) => {
    const localMs = baseTime + timezoneOffset * 1000 + new Date().getTimezoneOffset() * 60 * 1000;
    return new Date(localMs).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};

const WeatherCard = ({ city, removeCity, globalTime, isDarkMode }) => {
    const { data, error, isLoading } = useQuery([ "weather", city ], () => fetchWeather(city), {
        staleTime: 5 * 60 * 1000,
    });

    const weatherMainRaw = data?.weather?.[ 0 ]?.main || "Unknown";
    const weatherMain =
        weatherMainRaw.charAt(0).toUpperCase() + weatherMainRaw.slice(1).toLowerCase();
    const isThundersnow = weatherMain === "Snow" && data?.weather?.[ 0 ]?.description.includes("thunder");

    const weatherStyles = {
        Clouds: isDarkMode
            ? "bg-gradient-to-b from-blue-600 to-blue-200"
            : "bg-gradient-to-b from-gray-200 to-gray-400",
        Rain: isDarkMode
            ? "bg-gradient-to-b from-blue-800 to-blue-600"
            : "bg-gradient-to-b from-blue-200 to-blue-400",
        Clear: isDarkMode
            ? "bg-gradient-to-b from-yellow-900 to-orange-800"
            : "bg-gradient-to-b from-yellow-100 to-orange-200",
        Thunderstorm: isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-800"
            : "bg-gradient-to-b from-gray-600 to-black",
        Snow: isDarkMode
            ? "bg-gradient-to-b from-gray-700 to-blue-800"
            : "bg-gradient-to-b from-white to-blue-100",
        Haze: isDarkMode
            ? "bg-gradient-to-b from-yellow-900 to-gray-800"
            : "bg-gradient-to-b from-gray-300 to-gray-500 opacity-80",
        Mist: isDarkMode
            ? "bg-gradient-to-b from-gray-700 to-gray-600 opacity-80"
            : "bg-gradient-to-b from-gray-300 to-gray-500 opacity-80",
        Drizzle: isDarkMode
            ? "bg-gradient-to-b from-blue-700 to-blue-500"
            : "bg-gradient-to-b from-blue-100 to-blue-300",
        Unknown: isDarkMode ? "bg-gray-800" : "bg-gray-100",
    };

    const weatherIcons = {
        Clouds: (
            <FontAwesomeIcon
                icon={faCloud}
                className={`animate-cloud-move text-${isDarkMode ? "grey-100" : "gray-600"} text-4xl`}
            />
        ),
        Rain: (
            <FontAwesomeIcon
                icon={faCloudRain}
                className={`animate-rain-fall text-${isDarkMode ? "blue-300" : "blue-600"} text-4xl`}
            />
        ),
        Clear: (
            <FontAwesomeIcon
                icon={faSun}
                className={`animate-sun-shine text-${isDarkMode ? "yellow-300" : "yellow-500"} text-4xl`}
            />
        ),
        Thunderstorm: (
            <FontAwesomeIcon
                icon={faBolt}
                className={`animate-lightning-flash text-${isDarkMode ? "yellow-200" : "yellow-300"} text-4xl`}
            />
        ),
        Snow: isThundersnow ? (
            <div className="relative">
                <FontAwesomeIcon
                    icon={faSnowflake}
                    className={`animate-snow-fall text-${isDarkMode ? "gray-200" : "white"} text-4xl`}
                />
                <FontAwesomeIcon
                    icon={faBolt}
                    className={`animate-lightning-flash text-${isDarkMode ? "yellow-200" : "yellow-300"} text-3xl absolute top-2 left-1/2 transform -translate-x-1/2 z-10`}
                />
            </div>
        ) : (
            <FontAwesomeIcon
                icon={faSnowflake}
                className={`animate-snow-fall text-${isDarkMode ? "gray-200" : "white"} text-4xl`}
            />
        ),
        Haze: (
            <FontAwesomeIcon
                icon={faSmog}
                className={`animate-haze-drift text-${isDarkMode ? "gray-300" : "gray-400"} text-4xl`}
            />
        ),
        Mist: (
            <FontAwesomeIcon
                icon={faSmog}
                className={`animate-haze-drift text-${isDarkMode ? "gray-300" : "gray-400"} text-4xl`}
            />
        ),
        Drizzle: (
            <FontAwesomeIcon
                icon={faCloudRain}
                className={`animate-rain-fall text-${isDarkMode ? "blue-300" : "blue-500"} text-4xl`}
            />
        ),
        Unknown: <span className={`text-${isDarkMode ? "gray-400" : "gray-500"}`}>Unknown</span>,
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!data || !data.weather || !data.weather[ 0 ])
        return <div className="text-center">No weather data</div>;

    const localTime = getLocalTime(data.timezone, globalTime);

    return (
        <div
            className={`shadow-lg rounded-lg p-4 m-4 w-64 overflow-hidden relative ${weatherStyles[ weatherMain ] || "bg-white"
                }`}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold animate-bounce-slow text-gray-800">
                    {data.name}
                </h2>
                <button
                    onClick={() => removeCity(city)}
                    className={`text-red-500 hover:text-red-700 ${isDarkMode ? "text-red-300 hover:text-red-500" : ""
                        }`}
                >
                    ✕
                </button>
            </div>
            <p className="text-sm text-gray-700 text-center mt-1 animate-time-tick">
                Local Time: {localTime}
            </p>

            <div className="relative h-16 flex flex-col justify-center items-center">
                <p
                    className={`text-${isDarkMode ? "gray-300" : "gray-700"
                        } capitalize text-center font-medium relative z-10 mb-2`}
                    style={{
                        textShadow: isDarkMode
                            ? "0 1px 2px rgba(0, 0, 0, 0.8)"
                            : "0 1px 2px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {data.weather[ 0 ].description || "No description"}
                </p>
                <div className="absolute top-0 left-0 w-full h-16 overflow-hidden flex justify-center items-center">
                    {weatherIcons[ weatherMain ]}
                </div>
            </div>

            <p className="text-2xl font-semibold text-center mt-2 animate-pulse-temp text-gray-800">
                {data.main.temp}°C
            </p>
            <p className="text-sm text-gray-700 text-center">Feels Like: {data.main.feels_like}°C</p>

            <div className="mt-4 flex justify-center items-center">
                <div className="relative w-12 h-12">
                    <div
                        className="absolute bottom-0 w-full bg-blue-300 rounded-full animate-humidity-fill"
                        style={{ height: `${data.main.humidity}%` }}
                    ></div>
                    <div className="absolute w-full h-full flex justify-center items-center text-white font-bold">
                        {data.main.humidity}%
                    </div>
                </div>
                <p className="ml-2 text-gray-700">Humidity</p>
            </div>

            <div className="mt-4 flex justify-center items-center">
                <svg
                    className="w-6 h-6 animate-wind-spin"
                    style={{ "--wind-speed": Math.max(1, data.wind.speed) }}
                    fill="none"
                    stroke={isDarkMode ? "currentColor" : "currentColor"}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10l-2 1m0 0l-2-1m2 1v8m4-12l-2 1m0 0l-2-1m2 1v4m4-8l-2 1m0 0l-2-1m2 1v2"
                    />
                </svg>
                <p className="ml-2 text-gray-700">{data.wind.speed} m/s</p>
            </div>
        </div>
    );
};

export default WeatherCard;