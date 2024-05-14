import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { document } from "ionicons/icons";

import "./PDF.css";

const PDF = () => {
  const [form, setForm] = useState({
    schadensnummer: "",
    schadenart: "",
    versicherungszweig: "",
    anrede: "",
    titel: "",
    vorname: "",
    nachname: "",
    strasse: "",
    plz: "",
    ort: "",
    datum: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear">
              <IonIcon icon={document} size="large" color="black" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Blanko-Auftrag</h1>
        <form>
          <div className="input-group">
            <label>Schadensnummer</label>
            <input name="schadensnummer" value={form.schadensnummer} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Schadenart</label>
            <select name="schadenart" value={form.schadenart} onChange={handleChange}>
              <option value="">Bitte auswählen</option>
              <option value="Auto">Feuer</option>
              <option value="Fahrrad">Sturm</option>
            </select>
          </div>

          <div className="input-group">
            <label>Versicherungszweig</label>
            <input name="versicherungszweig" value={form.versicherungszweig} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Datum</label>
            <input type="date" name="datum" value={form.datum} onChange={handleChange} />
          </div>

          <h2>Kontaktdaten</h2>
          <div className="input-group">
            <label>Anrede</label>
            <select name="anrede" value={form.anrede} onChange={handleChange}>
              <option value="">Bitte auswählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
            </select>
          </div>

          <div className="input-group">
            <label>Titel</label>
            <input name="titel" value={form.titel} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Vorname</label>
            <input name="vorname" value={form.vorname} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Nachname</label>
            <input name="nachname" value={form.nachname} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Straße/Hausnummer</label>
            <input name="strasse" value={form.strasse} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>PLZ</label>
            <input name="plz" value={form.plz} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Ort</label>
            <input name="ort" value={form.ort} onChange={handleChange} />
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default PDF;
