import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const WeatherChart = ({ tempData }) => {
    const data = {
        labels: [ "Now", "1h Ago", "2h Ago", "3h Ago" ], // Mocked time labels
        datasets: [
            {
                label: "Temperature (°C)",
                data: tempData, // Example: [25, 24, 23, 22]
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: { y: { beginAtZero: false } },
    };

    return <Line data={data} options={options} />;
};

export default WeatherChart;