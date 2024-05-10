import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import React from "react";
import { isPlatform } from "@ionic/react";
import "./Login.css";
import { FingerprintAIO } from "@awesome-cordova-plugins/fingerprint-aio";

const Login: React.FC = () => {
  const router = useIonRouter();
  const doLogin = async () => {
    if (isPlatform("mobile")) {
      try {
        console.log("Attempting biometric authentication...");
        const result = await FingerprintAIO.show({
          title: "Biometrische Authentifizierung",
          subtitle: "Bestätigen Sie mit Fingerabdruck oder Gesichtserkennung",
          description: "Authentifizieren Sie sich, um fortzufahren",
          disableBackup: true, // Erlaubt keine Passwort-Eingabe als Backup
        });
        console.log("Authentication successful:", result);
        router.push("/app", "root");
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    } else {
      router.push("/app", "root");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="page-container">
        <IonButton expand="block" slot="fixed" className="auth-button" onClick={doLogin}>
          <IonIcon slot="start" icon={personCircleOutline} />
          <IonLabel>Biometrische Authentifizierung</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
