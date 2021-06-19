import React, { useEffect, useState } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";

const typeByColor = {
  blue: "total",
  red: "active",
  green: "recovered",
  grey: "deaths",
};

function LocationMarker({ lat, long }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition({ lat: lat, lng: long });
      map.flyTo({ lat: lat, lng: long }, map.getZoom(5));
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function CovidMap({
  covidData,
  mapMarkerInfo,
  selectedCountry,
  globalMaxCount,
  lat,
  long,
}) {
  const map = useMap();
  useEffect(() => {
    map.locate();
    map.zoomIn(1);
  }, [lat, long]);
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.keys(covidData).map((country) => {
        const { lat, long } = covidData[country]?.countryInfo;
        return (
          <CircleMarker
            center={[lat, long]}
            key={`${country}_map_id`}
            pathOptions={{ color: mapMarkerInfo.color }}
            radius={Math.max(
              5,
              (200 * covidData[country][mapMarkerInfo.type]) /
                globalMaxCount[[mapMarkerInfo.type]]
            )}
          >
            <Tooltip>
              {covidData[country][typeByColor[mapMarkerInfo.color]]}
            </Tooltip>
          </CircleMarker>
        );
      })}
      <LocationMarker lat={lat} long={long}>
        <Popup>{selectedCountry}</Popup>
      </LocationMarker>
    </>
  );
}
