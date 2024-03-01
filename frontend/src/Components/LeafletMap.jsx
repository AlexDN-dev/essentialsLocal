import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export const LeafletMap = ({ farmList, center }) => {
  // Fonction pour traiter la chaîne d'horaires
  function testing(schedule) {
    const joursSemaine = [
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche",
    ];
    const test = schedule.split(",");
    return (
      <ul className="popup">
        {test.map((item, index) => (
          <p key={index}>
            {joursSemaine[index]}: {item}
          </p>
        ))}
      </ul>
    );
  }
  if (!center || !center.latitude || !center.longitude) {
    center = { latitude: 0, longitude: 0 };
  }

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={12}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {farmList.map((farm) => (
        <Marker key={farm.id} position={[farm.latitude, farm.longitude]}>
          <Popup>
            <h3>{farm.name}</h3>
            <p>{farm.address}</p>
            <h3>Heure d'ouverture</h3>
            {testing(farm.schedule)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
