import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHistoryStore } from "../store/historyStore";

export default function History() {
  const { history, clear } = useHistoryStore();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
  {/* LEFT TEXT */}
  <View style={{ flex: 1 }}>
    <Text style={styles.title}>Translation History</Text>
    <Text style={styles.subtitle}>
      View and manage your communication history
    </Text>
  </View>

  {/* CLEAR BUTTON */}
  <TouchableOpacity style={styles.clearBtn} onPress={clear}>
    <Text style={styles.clearText}>Clear</Text>
  </TouchableOpacity>
</View>

      {/* LIST */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* TOP ROW */}
            <View style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.type === "camera"
                    ? "Sign → Text"
                    : "Speech → Sign"}
                </Text>
              </View>

              <Text style={styles.time}>🕐 {item.time}</Text>
            </View>

            {/* CONTENT */}
            <Text style={styles.label}>Input</Text>
            <Text style={styles.value}>{item.input}</Text>

            <Text style={styles.label}>Output</Text>
            <Text style={styles.value}>{item.output}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbee",
    paddingHorizontal: 20,
    paddingTop: 35,
  },

header: {
  flexDirection: "row",
  alignItems: "flex-start", // 🔥 important
  justifyContent: "space-between",
  marginBottom: 25,
},

title: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#222",
},

subtitle: {
  color: "#666",
  marginTop: 6,
  maxWidth: "85%", // 🔥 prevent overlap
},

clearBtn: {
  backgroundColor: "#50b9b6",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 20,
  marginTop: 5, // 🔥 aligns with title
},

  clearText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,

    // 🔥 shadow (iOS + Android)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  badge: {
    backgroundColor: "#015551",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    color: "#888",
    fontSize: 12,
  },

  label: {
    color: "#999",
    fontSize: 12,
    marginTop: 6,
  },

  value: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
});