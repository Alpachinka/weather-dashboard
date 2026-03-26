import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function getCurrentHourIndex(timesArray) {
  const now = new Date();
  const nowISO = now.toISOString().slice(0, 13);
  const index = timesArray.findIndex((t) => t.startsWith(nowISO));
  return index !== -1 ? index : 0;
}

export default function HourlyForecast({ hourly }) {
  if (!hourly) return null;

  const startIndex = getCurrentHourIndex(hourly.time);
  const times = hourly.time.slice(startIndex, startIndex + 24).map((t) => {
    const d = new Date(t);
    return d.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });
  const temps = hourly.temperature_2m.slice(startIndex, startIndex + 24);

  ChartJS.defaults.color = "rgba(255, 255, 255, 0.8)";

  const chartData = {
    labels: times,
    datasets: [
      {
        label: "Температура (°C)",
        data: temps,
        borderColor: "#ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false, color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { callback: (val) => val + "°" },
      },
    },
  };

  return (
    <section className="forecast-chart glass-panel">
      <h2>Прогноз на 24 години</h2>
      <div className="chart-container" style={{ position: "relative", height: "250px", width: "100%" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}
