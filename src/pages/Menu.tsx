import { IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { Redirect, Route } from "react-router";
import Home from "./Home";
import Location from "./Location";
import Login from "./Login";
import Notification from "./Notification";
import Photos from "./Photos";
import PDF from "./PDF";
import { person, fingerPrint, location, notifications, camera, document } from "ionicons/icons";

// Menükomponente, die die Navigation innerhalb der App ermöglicht
const Menu: React.FC = () => {
  // Pfade für die Menüeinträge mit ihren entsprechenden Icons
  const paths = [
    { name: "Willkommen", url: "/app/home", icon: person },
    { name: "Biometrie", url: "/app/login", icon: fingerPrint },
    { name: "Standortabfrage", url: "/app/location", icon: location },
    { name: "Benachrichtigungen", url: "/app/notification", icon: notifications },
    { name: "Fotos", url: "/app/photos", icon: camera },
    { name: "PDF Generator", url: "/app/pdf", icon: document },
  ];

  return (
    <IonPage>
      {/* Seitenmenü für die Navigation */}
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar color={"secondary"}>
            <IonTitle>Funktionen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* Menüeinträge dynamisch aus dem paths-Array generieren */}
          {paths.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem routerLink={item.url} routerDirection="none">
                <IonIcon slot="start" icon={item.icon} />
                {item.name}
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonContent>
      </IonMenu>

      {/* Hauptbereich der App, in dem die Seiteninhalte gerendert werden */}
      <IonRouterOutlet id="main">
        {/* Definition der Routen und ihrer entsprechenden Komponenten */}
        <Route exact path="/app/home" component={Home} />
        <Route exact path="/app/login" component={Login} />
        <Route exact path="/app/location" component={Location} />
        <Route exact path="/app/notification" component={Notification} />
        <Route exact path="/app/photos" component={Photos} />
        <Route exact path="/app/pdf" component={PDF} />
        {/* Standardroute, die auf die Willkommensseite weiterleitet */}
        <Route exact path="/app">
          <Redirect to="/app/home" />
        </Route>
      </IonRouterOutlet>
    </IonPage>
  );
};

export default Menu;
