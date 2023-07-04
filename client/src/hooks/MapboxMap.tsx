import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibXRuZGJzIiwiYSI6ImNsajhycWIwcDFjMm4zcG54dmtlanJ0eWIifQ.hocsW9xZOTg-6zuVdMb9EQ";

interface Props {
  longitude?: number;
  latitude?: number;
}

const MapboxMap = ({ latitude, longitude }: Props) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude ? longitude : -74.5, latitude ? latitude : 40],
      zoom: 10,
    });

    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div id="map" style={{ width: "100%", height: "260px", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px" }} />
  );
};

// function App() {
//   return (
//     <div className="App">
//       <h1>Mapbox Demo</h1>
//       <MapboxMap />
//     </div>
//   );
// }

export default MapboxMap;
