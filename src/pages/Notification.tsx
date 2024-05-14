import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import "./Notification.css";

const Notification: React.FC = () => {
  const initialTime = 5; // Anfangszeit in Sekunden

  const [remainingSeconds, setRemainingSeconds] = useState(initialTime); // Zustand für verbleibende Sekunden
  const [timerRunning, setTimerRunning] = useState(false); // Zustand, ob der Timer läuft
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null); // Zustand, ob Benachrichtigungen erlaubt sind

  // Funktion zur Überprüfung und Anforderung von Benachrichtigungsberechtigungen
  const checkAndRequestPermission = async () => {
    const permissionStatus: PermissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === "granted") {
      setNotificationsAllowed(true);
    } else {
      const requestStatus = await LocalNotifications.requestPermissions();
      setNotificationsAllowed(requestStatus.display === "granted");
    }
  };

  // Effekt, der beim Mounten der Komponente ausgeführt wird
  useEffect(() => {
    checkAndRequestPermission();
    createNotificationChannel(); // Benachrichtigungskanal erstellen
  }, []);

  // Funktion zur Erstellung eines Benachrichtigungskanals
  const createNotificationChannel = async () => {
    await LocalNotifications.createChannel({
      id: "high-priority-channel",
      name: "High Priority Channel",
      importance: 5,
      sound: "default",
    });
  };

  // Funktion zur Anzeige einer Benachrichtigung
  const showNotification = async () => {
    if (notificationsAllowed) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Timer",
            body: "Timer abgelaufen",
            id: 1,
            channelId: "high-priority-channel",
          },
        ],
      });
    } else {
      console.log("Benachrichtigungsberechtigung nicht erteilt.");
    }
  };

  // Funktion zum Starten des Timers
  const startTimer = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      setRemainingSeconds(initialTime);

      const timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            showNotification();
            setTimerRunning(false);
            return initialTime; // Timer zurücksetzen
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Benachrichtigungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="fullheight xc">
          <h2 className="timer-title">{remainingSeconds} Sekunden verbleibend</h2>
          <IonButton onClick={startTimer} disabled={timerRunning || notificationsAllowed === false} className="start-button">
            STARTE TIMER
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notification;
