import React, { useState, useEffect } from "react";
import { IonAlert, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonImg, IonModal, IonButton } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { camera, arrowBack, create } from "ionicons/icons";
import FilerobotImageEditor from "react-filerobot-image-editor";
import "./Photos.css";

interface Photo {
  dataUrl: string;
  title: string;
  filename: string;
}

const Photos: React.FC = () => {
  // Zustand für gespeicherte Fotos, Benachrichtigungen und Modals
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  // Lädt gespeicherte Fotos beim Starten der Komponente
  useEffect(() => {
    loadSavedPhotos();
  }, []);

  // Funktion zum Laden gespeicherter Fotos
  const loadSavedPhotos = async () => {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: "",
      });
      const loadedPhotos = await Promise.all(
        result.files.map(async (fileInfo) => {
          const fileName = fileInfo.name;
          if (fileName) {
            const photo = await Filesystem.readFile({
              directory: Directory.Data,
              path: fileName,
            });
            return {
              filename: fileName,
              dataUrl: `data:image/jpeg;base64,${photo.data}`,
              title: fileName,
            };
          }
        })
      );
      setPhotos(loadedPhotos.filter((photo) => photo !== undefined));
    } catch (e) {
      console.error("Fehler beim Laden der Fotos:", e);
    }
  };

  // Funktion zum Aufnehmen eines neuen Fotos
  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        quality: 90,
      });

      const fileName = `photo-${Date.now()}.jpeg`;
      if (photo.path) {
        const base64Data = await Filesystem.readFile({
          path: photo.path,
        });

        await Filesystem.writeFile({
          path: fileName,
          data: base64Data.data,
          directory: Directory.Data,
        });

        const newPhoto: Photo = {
          dataUrl: `data:image/jpeg;base64,${base64Data.data}`,
          title: `Foto ${photos.length + 1}`,
          filename: fileName,
        };

        setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
      }
    } catch (error) {
      console.error("Fehler beim Aufnehmen des Fotos:", error);
    }
  };

  // Funktion zum Löschen eines Fotos
  const deletePhoto = async () => {
    if (selectedPhoto) {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: selectedPhoto.filename,
      });
      setPhotos(photos.filter((p) => p.filename !== selectedPhoto.filename));
      setSelectedPhoto(null);
    }
    setShowAlert(false);
  };

  // Funktion zum Bearbeiten eines Fotos
  const editPhoto = (photo: Photo) => {
    setCurrentPhoto(photo);
    setShowEditor(true);
  };

  // Funktion zum Speichern des bearbeiteten Fotos
  const saveEditedPhoto = async (editedBase64: string) => {
    if (currentPhoto) {
      await Filesystem.writeFile({
        path: currentPhoto.filename,
        data: editedBase64.split(",")[1],
        directory: Directory.Data,
      });

      setPhotos((prevPhotos) => prevPhotos.map((p) => (p.filename === currentPhoto.filename ? { ...p, dataUrl: editedBase64 } : p)));
      setShowEditor(false);
      setShowModal(true);
      setCurrentPhoto({ ...currentPhoto, dataUrl: editedBase64 });
    }
  };

  // Funktion zum Verarbeiten des langen Tastendrucks
  const handleLongPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowAlert(true);
  };

  // Funktion zum Öffnen des Modals
  const openModal = (photo: Photo) => {
    setCurrentPhoto(photo);
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Fotogalerie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {photos.map((photo, index) => (
            <IonItem
              key={index}
              className="photo-item"
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(photo);
              }}
              onClick={() => openModal(photo)}
            >
              <IonImg src={photo.dataUrl} style={{ width: "100px", height: "100px" }} />
              <IonLabel>{photo.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton fill="clear" onClick={() => setShowModal(false)}>
                  <IonIcon icon={arrowBack} size="large" color="black" />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton fill="clear" onClick={() => currentPhoto && editPhoto(currentPhoto)}>
                  <IonIcon icon={create} size="large" color="black" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="full-screen-image">{currentPhoto && <IonImg src={currentPhoto.dataUrl} />}</IonContent>
        </IonModal>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Foto löschen"}
          message={"Möchten Sie dieses Foto wirklich löschen?"}
          buttons={[
            {
              text: "Abbrechen",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                setShowAlert(false);
              },
            },
            {
              text: "Löschen",
              handler: deletePhoto,
            },
          ]}
        />
        <IonModal isOpen={showEditor} onDidDismiss={() => setShowEditor(false)}>
          <IonContent>
            {currentPhoto && (
              <FilerobotImageEditor
                source={currentPhoto.dataUrl!}
                savingPixelRatio={1}
                previewPixelRatio={1}
                onSave={(editedImageObject) => {
                  saveEditedPhoto(editedImageObject.imageBase64!);
                }}
                onClose={() => setShowEditor(false)}
              />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Photos;
