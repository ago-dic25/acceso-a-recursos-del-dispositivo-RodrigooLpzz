import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para guardar fotos en la galería.');
      }
    })();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No se concedieron permisos para la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const fotoData = await cameraRef.current.takePictureAsync();
        setFoto(fotoData.uri);
        console.log('Foto tomada:', fotoData.uri);
        await MediaLibrary.saveToLibraryAsync(fotoData.uri);
        console.log('Foto guardada');
      } catch (error) {
        console.log('Error al tomar la foto:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} />
      </View>

      {foto && <Image source={{ uri: foto }} style={styles.preview} />}

      <TouchableOpacity style={styles.shutterButton} onPress={tomarFoto}>
        <View style={styles.innerCircle} />
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    width: '90%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1e90ff',
    marginBottom: 30,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  innerCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#ff4444',
    borderRadius: 25,
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
});
