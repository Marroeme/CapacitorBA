import React, { useState, useCallback } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonMenuButton } from "@ionic/react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Geolocation } from "@capacitor/geolocation";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 51.9606649,
  lng: 7.6261347,
};

const Location: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDpxU8F_yCa2Bk1Sif8p7XbMFHNF3N5hj0",
  });

  const [currentCenter, setCurrentCenter] = useState(initialCenter);
  const [currentMarker, setCurrentMarker] = useState(initialCenter);

  const getCurrentLocation = useCallback(async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const newCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentCenter(newCenter);
      setCurrentMarker(newCenter);
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Google Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={getCurrentLocation}>Gehe zu meinem Standort</IonButton>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={currentCenter} zoom={12}>
            <Marker position={currentMarker} />
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Location;
