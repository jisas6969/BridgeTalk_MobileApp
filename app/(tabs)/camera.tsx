import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHistoryStore } from "../store/historyStore";

export default function Camera() {
  const { add } = useHistoryStore();

  const [prediction, setPrediction] = useState("");
  const [lastPrediction, setLastPrediction] = useState("");

  const handleStart = () => {
    // 🔥 simulate prediction (replace with API)
    const result = "hello";

    setPrediction(result);

    // 🔥 SAVE TO HISTORY (ANTI SPAM)
    if (result && result !== lastPrediction) {
      add({
        id: Date.now().toString(),
        input: "gesture",
        output: result,
        type: "camera",
        time: new Date().toLocaleTimeString(),
      });

      setLastPrediction(result);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Language Recognition</Text>

      <View style={styles.cameraBox}>
        <Text>{prediction || "Camera Preview"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35,
    backgroundColor: "#fdfbee",
  },
  cameraBox: {
    width: "90%",
    height: 550,
    backgroundColor: "#ccc",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#50b9b6",
    padding: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
  },
});