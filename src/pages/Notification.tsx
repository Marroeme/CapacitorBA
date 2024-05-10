// Import necessary Ionic components and Capacitor Local Notifications
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import "./Notification.css"; // Import the external stylesheet

const Notification: React.FC = () => {
  // Initial timer duration
  const initialTime = 5; // 5 seconds

  // State variables to track remaining seconds and if the timer is running
  const [remainingSeconds, setRemainingSeconds] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);

  // Check and request notification permissions
  const checkAndRequestPermission = async () => {
    // Check for existing permission status
    const permissionStatus: PermissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display === "granted") {
      setNotificationsAllowed(true);
    } else {
      // Request permission if not already granted
      const requestStatus = await LocalNotifications.requestPermissions();
      setNotificationsAllowed(requestStatus.display === "granted");
    }
  };

  // Call permission check once on component mount
  useEffect(() => {
    checkAndRequestPermission();
    createNotificationChannel();
  }, []);

  const createNotificationChannel = async () => {
    await LocalNotifications.createChannel({
      id: "high-priority-channel",
      name: "High Priority Channel",
      importance: 5,
      sound: "default",
    });
  };

  const showNotification = async () => {
    if (notificationsAllowed) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Timer",
            body: "Timer abgelaufen",
            id: 1,
            channelId: "high-priority-channel", // Assign notification to high-priority channel
          },
        ],
      });
    } else {
      console.log("Permission not granted for notifications.");
    }
  };

  // Start timer countdown and update every second
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
            return initialTime; // Reset timer
          }
          return prev - 1;
        });
      }, 1000); // Update every second
    }
  };

  // JSX Layout with centered styling using external CSS classes
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Notification</IonTitle>
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
