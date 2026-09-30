import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MapEx3() {
  const navigate = useNavigate();

const handleMenuClick = (path) => {
  navigate(path);
}
  const mapRef = useRef(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [status, setStatus] = useState("");

  const genMap = async () => {
    try {
      setShowMap(true);
      const tt = window.tt;

      const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        address
      )}.json?key=OU5nusPkX745sgQmoQ1Ng8l0iKsOCieC`;
      const response = await fetch(url);
      const payload = await response.json();
      const lat = payload.results[0].position.lat;
      const lon = payload.results[0].position.lon;


      const map = tt.map({
        key: "OU5nusPkX745sgQmoQ1Ng8l0iKsOCieC",
        container: mapRef.current,
        source: "vector/1/basic-main",
        center: [lon, lat],
        zoom: 8,
      });

      map.addControl(new tt.FullscreenControl());
      map.addControl(new tt.NavigationControl());


      let marker = new tt.Marker().setLngLat([lon, lat]).addTo(map);

    
      let popupOffset = 25;
      let popup = new tt.Popup({ offset: popupOffset });
      popup.setHTML(
        `<div id="popup">Dating locations for ${address}</div>`
      );
      marker.setPopup(popup);

      marker = new tt.Marker().setLngLat([lon + 0.045, lat + 0.045]).addTo(map);
      popupOffset = 10;
      popup = new tt.Popup({ offset: popupOffset });
      popup.setHTML(
        `<div id="popup"><h3>Tim Hortons</h3><h3>Recommended Time: after 10am</h3></div>`
      );
      marker.setPopup(popup);

      marker = new tt.Marker().setLngLat([lon + 0.045, lat - 0.045]).addTo(map);
      popupOffset = 10;
      popup = new tt.Popup({ offset: popupOffset });
      popup.setHTML(
        `<div id="popup"><h3>Starbucks</h3><h3>Recommended Time: after 10am</h3></div>`
      );
      marker.setPopup(popup);

      marker = new tt.Marker().setLngLat([lon - 0.035, lat + 0.055]).addTo(map);
      popupOffset = 10;
      popup = new tt.Popup({ offset: popupOffset });
      popup.setHTML(
        `<div id="popup"><h3>City Park</h3><h3>Recommended Time: whenever</h3></div>`
      );
      marker.setPopup(popup);

      marker = new tt.Marker().setLngLat([lon - 0.055, lat - 0.05]).addTo(map);
      popupOffset = 10;
      popup = new tt.Popup({ offset: popupOffset });
      popup.setHTML(
        `<div id="popup"><h3>${address.split(",")[0]} Theatre</h3><h3>Recommended Time: after 5pm</h3></div>`
      );
      marker.setPopup(popup);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
    <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#f680dc" }}>
    Date Location Picker
    </h1>
    <div style={{ fontSize: "1.25rem",color: "#f680dc" }}>
    Find recommended date locations
    </div>
   

      <div>
        <input
          style={{ fontSize: "1.5rem", margin: "1rem" }}
          placeholder="enter current address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <button
          onClick={genMap}
          style={{
            width: "20vw",
            marginBottom: "1rem",
            backgroundColor: "#a1357d",
            padding: "0.5rem",
            fontSize: "1rem",
            color: "#ffffff"
            
          }}
        >
          Find
        </button>
      </div>

      {showMap && (
        <div
          ref={mapRef}
          style={{
            height: "50vh",
            width: "70vw",
            marginLeft: "15vw",
            border: "1px solid black",
          }}
        ></div>

        
      )}

  <div>
  <button
    onClick={() => handleMenuClick("/DatingSurvey")}
    style={{
      position: "fixed",
      bottom: "5px",
      right: "40px",
      width: "10vw",
      minWidth: "140px",
      height: "8vh",
      backgroundColor: "#a1357d",
      color: "#ffffff",
      borderRadius: "8px",
      fontSize: "1rem",
    }}
  >
    Complete a survey
  </button>
</div>

      {status && <div style={{ color: "red" }}>Error: {status}</div>}
    </div>
  );
}

export default MapEx3;
