// src/pages/Location.tsx
import React, { useState, useEffect, useCallback } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { locate } from "ionicons/icons";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";

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

  // Function to check and request location permissions
  const checkAndRequestLocationPermission = async () => {
    const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location !== "granted") {
      // Request permissions if not already granted
      const requestStatus = await Geolocation.requestPermissions();
    }
  };

  // Get the user's current location and update map position
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

  // Check location permissions on component mount
  useEffect(() => {
    checkAndRequestLocationPermission();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Standortabfrage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={currentCenter} zoom={12}>
            <Marker position={currentMarker} />
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}

        {/* IonFab for the button over the map */}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={getCurrentLocation}>
            <IonIcon icon={locate} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Location;
