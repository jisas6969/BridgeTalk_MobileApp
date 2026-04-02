import Slider from "@react-native-community/slider";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSettingsStore } from "../store/settingsStore";

export default function Settings() {
  const [volume, setVolume] = useState(75);
  const speed = useSettingsStore((s) => s.speed);
  const setSpeed = useSettingsStore((s) => s.setSpeed);
  const [runtime, setRuntime] = useState("00:00");
  const [memory, setMemory] = useState(40);

  const animatedMemory = useRef(new Animated.Value(memory)).current;

  // 🔥 runtime + memory simulation
  useEffect(() => {
    let seconds = 0;

    const interval = setInterval(() => {
      seconds++;

      const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secs = String(seconds % 60).padStart(2, "0");

      setRuntime(`${mins}:${secs}`);

      const newMemory = Math.floor(Math.random() * 80) + 20;
      setMemory(newMemory);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 animate memory bar
  useEffect(() => {
    Animated.timing(animatedMemory, {
      toValue: memory,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [memory]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* TITLE */}
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Control your app preferences
      </Text>

      {/* ================= SETTINGS ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Settings</Text>

        {/* VOLUME */}
        <View style={styles.item}>
          <Text style={styles.label}> Voice Volume</Text>
          <Text style={styles.value}>{volume}%</Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="#50b9b6"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#50b9b6"
        />

        {/* SPEED */}
        <View style={styles.item}>
          <Text style={styles.label}> Avatar Speed</Text>
          <Text style={styles.value}>{speed.toFixed(1)}x</Text>
        </View>

        <Slider
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          value={speed}
          onValueChange={(value) => {
  setSpeed(value);
}}
          minimumTrackTintColor="#50b9b6"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#50b9b6"
        />

        {/* RESET */}
        <Text
          style={styles.reset}
          onPress={() => {
            setVolume(75);
            setSpeed(1);
          }}
        >
          Reset to Default
        </Text>
      </View>

      {/* ================= INFO ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>System Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}> Version</Text>
          <Text style={styles.infoValue}>v1.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}> Runtime</Text>
          <Text style={styles.infoValue}>{runtime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}> Memory</Text>
          <Text style={styles.infoValue}>{memory}%</Text>
        </View>

        {/* ANIMATED BAR */}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: animatedMemory.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbee",
    padding: 20,
    paddingTop: 35,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "#333",
  },

  value: {
    fontWeight: "bold",
    color: "#50b9b6",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  infoLabel: {
    color: "#333",
  },

  infoValue: {
    fontWeight: "bold",
    color: "#50b9b6",
  },

  progressBar: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#50b9b6",
    borderRadius: 10,
  },

  reset: {
    marginTop: 15,
    color: "#50b9b6",
    textAlign: "center",
    fontWeight: "bold",
  },
});