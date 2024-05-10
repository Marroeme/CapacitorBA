import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import "./Home.css"; // CSS-Datei importieren

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Willkommen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="page-content">
        <IonText slot="fixed">
          <h2>Wähle eine Anforderung aus dem Menü.</h2>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
