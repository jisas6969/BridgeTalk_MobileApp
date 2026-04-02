import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#015551",
          height: 70,
        },
        tabBarActiveTintColor: "#50b9b6",
        tabBarInactiveTintColor: "white",
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "index") iconName = "home";
          if (route.name === "camera") iconName = "camera";
          if (route.name === "avatar") iconName = "person";
          if (route.name === "select_avatar") iconName = "people";
          if (route.name === "history") iconName = "time";
          if (route.name === "settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="avatar" options={{ title: "Avatar" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />

      {/* 🔥 ADD TAB */}
      <Tabs.Screen
        name="select_avatar"
        options={{ title: "Select" }}
      />
    </Tabs>
  );
}