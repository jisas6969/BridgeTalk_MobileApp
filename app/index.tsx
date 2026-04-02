import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Splash() {
  const router = useRouter();

  // 🔥 loading steps (like desktop)
  const steps = [
    "Initializing AI models...",
    "Loading MediaPipe...",
    "Setting up speech engine...",
    "Loading 3D avatar...",
    "Preparing UI...",
    "Launching Bridge Talk...",
  ];

  const [stepIndex, setStepIndex] = useState(0);

  // 🔥 animations
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // 🔥 DOT ANIMATION
  const animateDot = (anim: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // 🔥 logo zoom in
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);

    // 🔥 STEP PROGRESSION
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setStepIndex(i);
      } else {
        clearInterval(interval);

        // 🔥 FADE OUT
        Animated.timing(fade, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          router.replace("/home");
        });
      }
    }, 900); // adjust speed

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <LinearGradient
        colors={["#015551", "#017a75", "#015551"]}
        style={styles.container}
      >
        {/* 🔥 LOGO (CINEMATIC SCALE) */}
        <Animated.Text
          style={[
            styles.title,
            { transform: [{ scale }] },
          ]}
        >
          Bridge Talk
        </Animated.Text>

        {/* SUBTITLE */}
        <Text style={styles.subtitle}>
          AI-powered communication
        </Text>

        {/* 🔥 DYNAMIC STATUS */}
        <Text style={styles.status}>
          {steps[stepIndex]}
        </Text>

        {/* DOTS */}
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>

        {/* VERSION */}
        <Text style={styles.version}>
          v1.0 • Real-time ASL ↔ English
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#f8f7ef",
    fontSize: 16,
    marginBottom: 30,
  },

  status: {
    color: "#ccc",
    marginBottom: 20,
  },

  dots: {
    flexDirection: "row",
    gap: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f8f7ef",
  },

  version: {
    position: "absolute",
    bottom: 40,
    color: "#ccc",
    fontSize: 12,
  },
});