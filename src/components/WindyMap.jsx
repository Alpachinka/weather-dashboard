// Lazy iframe — loads only when user scrolls to it; zero JS bundle impact
export default function WindyMap({ lat, lon }) {
  // Default to Kyiv if no coords
  const latitude = lat ?? 50.45;
  const longitude = lon ?? 30.52;

  const src = `https://embed.windy.com/embed2.html?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}&detailLat=${latitude.toFixed(2)}&detailLon=${longitude.toFixed(2)}&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  return (
    <section className="glass-panel windy-panel fade-in">
      <h2>Карта вітру та погоди</h2>
      <p className="windy-subtitle">Інтерактивна карта вітрових потоків та опадів у реальному часі — Windy.com</p>
      <div className="windy-container">
        <iframe
          src={src}
          title="Windy weather map"
          loading="lazy"
          allowFullScreen
          style={{ border: "none", borderRadius: "16px", width: "100%", height: "450px" }}
        />
      </div>
    </section>
  );
}
