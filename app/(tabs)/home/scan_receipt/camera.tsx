import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function CameraScreen() {
  const router = useRouter(); // Add this
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      console.log("Taking picture...");
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });
      console.log("Picture taken, base64 length:", photo.base64?.length);

      // Use your computer's local network IP address
      // Run 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux) to find it
      const API_URL = "https://splitlah-backend.onrender.com/upload"; // Replace with your IP
      console.log("Sending to:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add CORS headers
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          image: photo.base64,
        }),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("API Response:", result);
      router.push("/home/scan_receipt/view_receipt");
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  //   const handleTakePicture = async () => {
  //     try {
  //       const data = await fetch("http://127.0.0.1:5000/", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //       });
  //       console.log("Sending to:", data.json());
  //     } catch (error) {
  //       console.error("Network error:", error);
  //     }
  //   };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
            {photo && <Text style={styles.text}>Photo taken</Text>}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
