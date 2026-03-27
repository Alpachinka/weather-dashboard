import { useState } from "react";
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

const CHART_TYPES = [
  { key: "temperature", label: "🌡 Температура", color: "rgba(255, 255, 255, 0.9)" },
  { key: "wind", label: "💨 Вітер", color: "rgba(147, 197, 253, 0.9)" },
  { key: "precipitation", label: "🌧 Опади", color: "rgba(165, 243, 252, 0.9)" },
];

export default function HourlyForecast({ hourly, unit }) {
  const [chartType, setChartType] = useState("temperature");

  if (!hourly) return null;

  const startIndex = getCurrentHourIndex(hourly.time);
  const rawTimes = hourly.time.slice(startIndex, startIndex + 24);
  const times = rawTimes.map((t) => {
    const d = new Date(t);
    return d.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  ChartJS.defaults.color = "rgba(255, 255, 255, 0.8)";

  const getDataset = () => {
    if (chartType === "temperature") {
      const rawTemps = hourly.temperature_2m.slice(startIndex, startIndex + 24);
      const temps = unit === "F" ? rawTemps.map((t) => t * 9/5 + 32) : rawTemps;
      return {
        data: temps,
        unit: `°${unit}`,
        color: CHART_TYPES[0].color,
        label: `Температура (°${unit})`,
      };
    }
    if (chartType === "wind") {
      const wind = (hourly.wind_speed_10m || []).slice(startIndex, startIndex + 24);
      return {
        data: wind,
        unit: "км/год",
        color: CHART_TYPES[1].color,
        label: "Швидкість вітру (км/год)",
      };
    }
    if (chartType === "precipitation") {
      const precip = (hourly.precipitation_probability || []).slice(startIndex, startIndex + 24);
      return {
        data: precip,
        unit: "%",
        color: CHART_TYPES[2].color,
        label: "Ймовірність опадів (%)",
      };
    }
  };

  const ds = getDataset();

  const chartData = {
    labels: times,
    datasets: [
      {
        label: ds.label,
        data: ds.data,
        borderColor: ds.color,
        backgroundColor: ds.color.replace("0.9", "0.15"),
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
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(25, 35, 50, 0.9)",
        titleFont: { size: 13, family: "Inter", weight: "normal" },
        bodyFont: { size: 15, family: "Inter", weight: "bold" },
        titleColor: "rgba(255, 255, 255, 0.7)",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const d = new Date(rawTimes[index]);
            return d.toLocaleString("uk-UA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit"
            });
          },
          label: (context) => {
            return `${ds.label.split("(")[0].trim()}: ${Math.round(context.parsed.y)} ${ds.unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { callback: (val) => Math.round(val) + " " + ds.unit },
      },
    },
  };

  return (
    <section className="forecast-chart glass-panel">
      <h2>Прогноз на 24 години</h2>

      {/* Chart type switcher */}
      <div className="chart-switcher">
        {CHART_TYPES.map((ct) => (
          <button
            key={ct.key}
            className={`chart-switch-btn ${chartType === ct.key ? "active" : ""}`}
            onClick={() => setChartType(ct.key)}
          >
            {ct.label}
          </button>
        ))}
      </div>

      <div className="chart-container" style={{ position: "relative", height: "220px", width: "100%" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}
