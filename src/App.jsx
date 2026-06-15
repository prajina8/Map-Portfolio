import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import nepalGeoJson from "./nepal.json";
import { GeoJSON } from "react-leaflet";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

export default function App() {
  const [places, setPlaces] = useState([]);

  
  useEffect(() => {
    const data = localStorage.getItem("places");
    if (data) setPlaces(JSON.parse(data));
  }, []);

  
  useEffect(() => {
    localStorage.setItem("places", JSON.stringify(places));
  }, [places]);

  function MapClick() {
    useMapEvents({
      click(e) {
        const name = prompt("Enter place name:");
        if (!name) return;

        const newPlace = {
          id: Date.now(),
          name,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };

        setPlaces((prev) => [...prev, newPlace]);
      },
    });
    return null;
  }
  const nepalBounds = [
  [26.347, 80.058],
  [30.447, 88.201],
];
  

  return (
  <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

    {/* TOP HEADER */}
    <div
      style={{
        textAlign: "center",
        padding: "15px",
        background: "#2c3e50",
        color: "white",
        fontSize: "22px",
        fontWeight: "bold",
      }}
    >
      My Travel Diary
    </div>

    {/* MAIN CONTENT */}
    <div style={{ display: "flex", flex: 1 }}>

      {/* LEFT PANEL */}
      <div style={{ width: "30%", padding: "10px", background: "#f4f4f4" }}>
        

        {places.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "8px",
              margin: "5px",
              background: "white",
              borderRadius: "6px",
            }}
          >
            <b>{p.name}</b>
            <br />
            {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
          </div>
        ))}
      </div>

      {/* MAP */}
      <div id ="map" className="h-screen w-full" style={{ width: "70%" ,height: "70%"}}>
        <MapContainer
          center={[28.3949, 84.1240]}
          zoom={7}
          maxBounds={{nepalBounds}}
          maxBoundsViscosity={1.0}
          minZoom={2}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
            <GeoJSON
    data={nepalGeoJson}
    style={{ color: "red", weight: 2, fillColor: "rgba(255,0,0,0.2)", fillOpacity: 0.4 }}
  />

          <MapClick />

          {places.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <b>{p.name}</b>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  </div>
);
}