import React, { useState, useEffect } from "react";
import { IonAlert, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonImg, IonModal, IonButton } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { camera, arrowBack } from "ionicons/icons";
import "./Photos.css";

interface Photo {
  dataUrl: string;
  title: string;
  filename: string;
}

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  const handleLongPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowAlert(true);
  };

  const openModal = (photo: Photo) => {
    setCurrentPhoto(photo);
    setShowModal(true);
  };

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
      setPhotos(loadedPhotos.filter((photo) => photo !== undefined)); // Filtern undefined Werte aus, falls vorhanden
    } catch (e) {
      console.error("Error loading photos:", e);
    }
  };

  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // Change to Uri to save file instead of DataUrl
        quality: 90,
      });

      const fileName = `photo-${Date.now()}.jpeg`;
      if (photo.path) {
        const base64Data = await Filesystem.readFile({
          path: photo.path, // Make sure this is a string as expected
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
      console.error("Error taking photo:", error);
    }
  };

  const deletePhoto = async () => {
    if (selectedPhoto) {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: selectedPhoto.filename,
      });
      setPhotos(photos.filter((p) => p.filename !== selectedPhoto.filename));
      setSelectedPhoto(null); // Reset nach dem Löschen
    }
    setShowAlert(false); // Schließen des Alerts
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
                e.preventDefault(); // Verhindert das normale Kontextmenü
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
          <IonContent className="full-screen-image">
            <IonButton fill="clear" className="back-button" onClick={() => setShowModal(false)}>
              <IonIcon icon={arrowBack} size="large" />
            </IonButton>
            {currentPhoto && <IonImg src={currentPhoto.dataUrl} />}
          </IonContent>
        </IonModal>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
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
            handler: (blah) => {
              setShowAlert(false);
            },
          },
          {
            text: "Löschen",
            handler: () => {
              deletePhoto();
            },
          },
        ]}
      />
    </IonPage>
  );
};

export default Photos;
