import React, { useState, useEffect, useCallback } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { locate } from "ionicons/icons";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";

// Stil des Kartencontainers
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Anfangscenter für die Karte (Münster, Deutschland)
const initialCenter = {
  lat: 51.9606649,
  lng: 7.6261347,
};

const Location: React.FC = () => {
  // Laden des Google Maps API Skripts
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDpxU8F_yCa2Bk1Sif8p7XbMFHNF3N5hj0", // In produktiver Anwendung sicherstellen, dass dieser Schlüssel nicht im Quellcode steht
  });

  const [currentCenter, setCurrentCenter] = useState(initialCenter); // Zustand für das aktuelle Karten-Center
  const [currentMarker, setCurrentMarker] = useState(initialCenter); // Zustand für die aktuelle Marker-Position

  // Funktion zur Überprüfung und Anforderung von Standortberechtigungen
  const checkAndRequestLocationPermission = async () => {
    try {
      const permissionStatus: PermissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus.location !== "granted") {
        // Berechtigungen anfordern, wenn nicht bereits gewährt
        await Geolocation.requestPermissions();
      }
    } catch (error) {
      console.error("Fehler beim Überprüfen oder Anfordern von Standortberechtigungen:", error);
    }
  };

  // Abrufen der aktuellen Position des Benutzers und Aktualisierung der Kartenposition
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
      console.error("Fehler beim Abrufen der aktuellen Position:", error);
    }
  }, []);

  // Überprüfen der Standortberechtigungen beim Mounten der Komponente
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
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentCenter}
            zoom={12} // Zoomstufe der Karte
          >
            <Marker position={currentMarker} /> // Marker an der aktuellen Position
          </GoogleMap>
        ) : (
          <div>Laden...</div> // Fallback-Anzeige während des Ladens
        )}

        {/* Floating Action Button (IonFab) über der Karte */}
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
