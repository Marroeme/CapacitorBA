import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

const PDF: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>PDF</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">UI goes here...</IonContent>
    </IonPage>
  );
};

export default PDF;
