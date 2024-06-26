import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import "./Home.css";

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
      <IonContent>
        <IonText className="page-content">
          <p>Wähle eine Anforderung aus dem Menü.</p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
