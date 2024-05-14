import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import React from "react";
import { isPlatform } from "@ionic/react";
import "./Login.css";
import { FingerprintAIO } from "@awesome-cordova-plugins/fingerprint-aio";

const Login: React.FC = () => {
  const router = useIonRouter();

  // Funktion zur Durchführung der Anmeldung mit biometrischer Authentifizierung
  const doLogin = async () => {
    if (isPlatform("mobile")) {
      // Prüft, ob die App auf einem mobilen Gerät läuft
      try {
        console.log("Versuch der biometrischen Authentifizierung...");
        const result = await FingerprintAIO.show({
          title: "Biometrische Authentifizierung",
          subtitle: "Bestätigen Sie mit Fingerabdruck oder Gesichtserkennung",
          description: "Authentifizieren Sie sich, um fortzufahren",
          disableBackup: true, // Erlaubt keine Passwort-Eingabe als Backup
        });
        console.log("Authentifizierung erfolgreich:", result);
        router.push("/app", "root"); // Weiterleitung zur Hauptanwendung nach erfolgreicher Authentifizierung
      } catch (error) {
        console.error("Authentifizierung fehlgeschlagen:", error); // Fehlerbehandlung für Authentifizierungsfehler
      }
    } else {
      router.push("/app", "root"); // Weiterleitung zur Hauptanwendung auf nicht-mobilen Geräten
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
