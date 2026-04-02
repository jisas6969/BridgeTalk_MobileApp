import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform, StyleSheet, TextInput, View
} from "react-native";
import { WebView } from "react-native-webview";
import { useHistoryStore } from "../store/historyStore";
import { useSettingsStore } from "../store/settingsStore";


export default function Avatar() {
  const webviewRef = useRef<any>(null);
  const params = useLocalSearchParams();
  const { add } = useHistoryStore();

  const [lastText, setLastText] = useState("");

  const speed = useSettingsStore((s) => s.speed);

  const defaultAvatar =
    "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/avatar/avatar.glb";

  const avatarUrl =
    typeof params.avatar === "string" ? params.avatar : defaultAvatar;

  /** Sanitize a string so it can be safely embedded inside a JS string literal */
  const sanitizeForJS = (str: string): string =>
    str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
      

  const [text, setText] = useState("");
  useEffect(() => {
  if (!webviewRef.current) return;

  const jsCode = `
    window.setSpeed(${speed});
    true;
  `;

  webviewRef.current.injectJavaScript(jsCode);
}, [speed]);
  const handleSubmit = useCallback(() => {
  const rawText = text.trim();

  if (!rawText) return;

  const safe = sanitizeForJS(rawText);
  const jsCode = `
  window.setSpeed(${speed});
  window.playAnimation('${safe}');
  true;
`;
  webviewRef.current?.injectJavaScript(jsCode);

  if (rawText !== lastText) {
    add({
      id: Date.now().toString(),
      input: rawText,
      output: "avatar animation",
      type: "speech",
      time: new Date().toLocaleTimeString(),
    });
    setLastText(rawText);
  }

  setText("");
}, [text, lastText, add]);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin:0; overflow:hidden; background:#fdfbee; }
    </style>
  </head>
  <body>

  <script src="https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.146.0/examples/js/loaders/GLTFLoader.js"></script>

  <script>

  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfdfbee);

  let camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3.3);
  camera.lookAt(0, 1.7, 0);

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // 🔥 DRAG ROTATION CONTROLS
renderer.domElement.addEventListener("pointerdown", (e) => {
  isDragging = true;
  lastX = e.clientX;
});

renderer.domElement.addEventListener("pointermove", (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - lastX;
  lastX = e.clientX;

  // 🔥 DIRECT CONTROL (SMOOTH AF)
  targetRotation += deltaX * 0.01;
});

renderer.domElement.addEventListener("pointerup", () => {
  isDragging = false;
});

renderer.domElement.addEventListener("pointerleave", () => {
  isDragging = false;
});

  let light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  scene.add(light);

  let mixer, model, currentAction, idleAction;
  let rotationY = 0;
let targetRotation = 0;
let isDragging = false;
let lastX = 0;
  let animationSpeed = 1;

function setSpeed(speed) {
  animationSpeed = speed;
}
window.setSpeed = setSpeed;
  let animationQueue = [];
  let isPlayingSequence = false;
  const animationCache = {};

  const clock = new THREE.Clock();

  let fixedPosition = new THREE.Vector3(0, -0.3, 0);
  let fixedRotation = new THREE.Euler(0, 0, 0);
  let fixedScale = new THREE.Vector3(1.5, 1.5, 1.5);

  const animationMap = {
    "help": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/Help.glb",
    "sorry": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/Sorry.glb",
    "thanks": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/Thanks.glb",
    "thank you": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/Thank%20you.glb",
    "yes": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/Yes.glb",
    "no": "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/No.glb"
  };

  function fadeToAction(action, duration, loop) {
    if (!action) return;

    if (loop) {
      action.setLoop(THREE.LoopRepeat);
      action.clampWhenFinished = false;
    } else {
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
    }

    action.reset();

    if (currentAction && currentAction !== action) {
      currentAction.crossFadeTo(action, duration, true);
    }

    action.play();
    currentAction = action;
  }

  function preloadAll() {
    const loader = new THREE.GLTFLoader();

    for (let key in animationMap) {
      loader.load(animationMap[key], function (gltf) {
        if (gltf.animations.length > 0) {
          animationCache[key] = gltf.animations[0];
        }
      });
    }
  }

  function loadIdle() {
    const loader = new THREE.GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/idle.glb",
      function (gltf) {
        const clip = gltf.animations[0];
        idleAction = mixer.clipAction(clip);

        idleAction.reset();
        idleAction.setLoop(THREE.LoopRepeat);
        idleAction.clampWhenFinished = false;
        idleAction.play();

        currentAction = idleAction;
      }
    );
  }

  function playSequence(sequence) {
    if (isPlayingSequence) {
      // If already playing, stop current and start new sequence
      animationQueue = [];
      isPlayingSequence = false;
      if (currentAction) {
        currentAction.stop();
      }
    }

    animationQueue = [...sequence];
    isPlayingSequence = true;

    playNext();
  }

  function playNext() {
    if (animationQueue.length === 0) {
      isPlayingSequence = false;

      // Always reset back to idle
      if (idleAction) {
        idleAction.reset();
        fadeToAction(idleAction, 0.4, true);
      }
      return;
    }

    const key = animationQueue.shift();
    const clip = animationCache[key];

    if (!clip) {
      playNext();
      return;
    }

    const action = mixer.clipAction(clip);
    fadeToAction(action, 0.3, false);
  }

  function setupMixerEvents() {
    mixer.addEventListener('finished', function () {
      playNext();
    });
  }

  function getSequence(text) {
    const input = text.toLowerCase().trim();
    const sequence = [];

    // Sort keys by length (longest first) to match multi-word phrases before single words
    const sortedKeys = Object.keys(animationMap).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (input.includes(key)) {
        sequence.push(key);
      }
    }

    return sequence;
  }

  function playAnimation(text) {
    const sequence = getSequence(text);
    if (sequence.length === 0) return;

    playSequence(sequence);
  }

  function changeAvatar(url) {
    const loader = new THREE.GLTFLoader();

    loader.load(url, function (gltf) {

      if (model) {
        scene.remove(model);
      }

      model = gltf.scene;
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);

      setupMixerEvents();
      loadIdle();
      preloadAll();
    });
  }

  window.changeAvatar = changeAvatar;
  window.playAnimation = playAnimation;

  changeAvatar("${sanitizeForJS(avatarUrl)}");

  function animate() {
    requestAnimationFrame(animate);

    let delta = clock.getDelta();
if (mixer) mixer.update(delta * animationSpeed);

    if (model) {
      model.position.copy(fixedPosition);
      rotationY += (targetRotation - rotationY) * 0.15;
      model.rotation.set(0, rotationY, 0);
      model.scale.copy(fixedScale);
    }

    renderer.render(scene, camera);
  }

  animate();

  </script>

  </body>
  </html>
  `;

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={20}
  >
    <View style={styles.container}>

      {/* AVATAR */}
      <View style={styles.avatarBox}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          style={{ flex: 1 }}
        />
      </View>

      {/* INPUT */}
      <TextInput
        placeholder="Type to translate"
        style={styles.input}
        returnKeyType="send"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />

    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbee",
    padding: 15,
  },
  avatarBox: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fdfbee",
    padding: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#bbb",
  },
});