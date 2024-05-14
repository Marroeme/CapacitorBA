import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { document, arrowBack } from "ionicons/icons";
import { jsPDF } from "jspdf";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import packageJson from "../../package.json";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./PDF.css";

const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

const PDF: React.FC = () => {
  // Initialer Zustand für das Formular
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

  const [pdfData, setPdfData] = useState<string | null>(null); // Zustand für die PDF-Daten
  const [showPdfModal, setShowPdfModal] = useState(false); // Zustand für das PDF-Vorschau-Modalfenster

  // Funktion zur Handhabung von Formularänderungen
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Funktion zum Generieren des PDFs
  const generatePdf = () => {
    const doc = new jsPDF();

    // Schriftart und -größe setzen
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Blanko-Auftrag", 10, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Schadensnummer:", 10, 35);
    doc.setFont("helvetica", "normal");
    doc.text(form.schadensnummer, 50, 35);

    doc.setFont("helvetica", "bold");
    doc.text("Schadenart:", 10, 45);
    doc.setFont("helvetica", "normal");
    doc.text(form.schadenart, 35, 45);

    doc.setFont("helvetica", "bold");
    doc.text("Versicherungszweig:", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(form.versicherungszweig, 53, 55);

    doc.setFont("helvetica", "bold");
    doc.text("Datum:", 10, 65);
    doc.setFont("helvetica", "normal");
    doc.text(form.datum, 30, 65);

    // Horizontale Linie hinzufügen
    doc.setLineWidth(0.5);
    doc.line(10, 80, 200, 80);

    // Kontaktdaten
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Kontaktdaten", 10, 90);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${form.anrede} ${form.vorname} ${form.nachname}`, 10, 100);
    doc.text(form.strasse, 10, 110);
    doc.text(`${form.plz} ${form.ort}`, 10, 120);

    const pdfDataUri = doc.output("datauristring");
    setPdfData(pdfDataUri); // PDF-Daten setzen
    setShowPdfModal(true); // PDF-Vorschau-Modalfenster öffnen
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={generatePdf}>
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
              <option value="Feuer">Feuer</option>
              <option value="Sturm">Sturm</option>
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

      <IonModal isOpen={showPdfModal} onDidDismiss={() => setShowPdfModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowPdfModal(false)}>
                <IonIcon icon={arrowBack} />
              </IonButton>
            </IonButtons>
            <IonTitle>PDF Vorschau</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {pdfData && (
            <div style={{ height: "100%" }}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfData} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default PDF;
