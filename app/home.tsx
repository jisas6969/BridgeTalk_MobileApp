import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translation Selection Mode</Text>
      <Text style={styles.subtitle}>Choose your translation mode</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.replace("/(tabs)/camera")}
      >
        <Text>Sign Language to Text</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.replace("/(tabs)/avatar")}
      >
        <Text>Speech to Sign</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbee",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 20,
  },
  card: {
    width: 200,
    height: 100,
    backgroundColor: "#fff",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
