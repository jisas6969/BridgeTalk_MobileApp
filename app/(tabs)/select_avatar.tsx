import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export default function SelectAvatar() {
  const router = useRouter();

  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const prevRef = useRef<any>(null);
  const currentRef = useRef<any>(null);
  const nextRef = useRef<any>(null);

  const [ready, setReady] = useState({
    prev: false,
    current: false,
    next: false,
  });

  const avatars = [
    { name: "Julio", file: "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/avatar/avatar.glb" },
    { name: "Iris", file: "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/avatar/avatar2.glb" },
    { name: "Lucas", file: "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/avatar/avatar3.glb" },
    { name: "Maya", file: "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/avatar/avatar4.glb" },
  ];

  const [index, setIndex] = useState(0);

  const current = avatars[index];
  const next = avatars[(index + 1) % avatars.length];
  const prev = avatars[(index - 1 + avatars.length) % avatars.length];

  const previewHTML = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;overflow:hidden;background: #fdfbee">
  <script src="https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.146.0/examples/js/loaders/GLTFLoader.js"></script>

  <script>
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,1.4,2.2);

  let renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  document.body.appendChild(renderer.domElement);

  let light = new THREE.HemisphereLight(0xffffff,0x444444,1.5);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  const clock = new THREE.Clock();

  let mixer;
  let model;
  let idleClip;

  loader.load(
    "https://raw.githubusercontent.com/jisas6969/avatar-assets/main/animations/idle.glb",
    (gltf) => {
      idleClip = gltf.animations[0];
    }
  );

  function loadAvatar(url){
    loader.load(url, (gltf) => {

      if(model){
        scene.remove(model);
        mixer = null;
      }

      model = gltf.scene;
      model.position.set(0,-0.6,0);
      model.scale.set(1.5,1.5,1.5);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);

      const playIdle = () => {
        if (!idleClip || !mixer) return;
        const action = mixer.clipAction(idleClip);
        action.setLoop(THREE.LoopRepeat);
        action.play();
      };

      if (idleClip) playIdle();
      else setTimeout(playIdle, 100);
    });
  }

  window.previewAvatar = loadAvatar;

  function animate(){
    requestAnimationFrame(animate);
    if(mixer) mixer.update(clock.getDelta());
    renderer.render(scene,camera);
  }
  animate();
  </script>
  </body>
  </html>
  `;

  const inject = (ref: any, url: string) => {
    if (!ref?.current) return;

    ref.current.injectJavaScript(`
      if(window.previewAvatar){
        window.previewAvatar("${url}");
      }
      true;
    `);
  };

  // ✅ ONLY CURRENT FIRST
  useEffect(() => {
    if (ready.current) {
      inject(currentRef, current.file);

      // preload others AFTER
      setTimeout(() => {
        if (ready.next) inject(nextRef, next.file);
        if (ready.prev) inject(prevRef, prev.file);
      }, 250);
    }
  }, [index, ready]);

  const changeIndex = (dir: number) => {
    setIndex((prev) => (prev + dir + avatars.length) % avatars.length);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, g) => {
        translateX.setValue(g.dx);
      },

      onPanResponderRelease: (_, g) => {
        if (isSwiping.current) return;

        if (g.dx > 120 || g.vx > 0.5) {
          isSwiping.current = true;

          Animated.timing(translateX, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            changeIndex(-1);
            translateX.setValue(0);
            isSwiping.current = false;
          });

        } else if (g.dx < -120 || g.vx < -0.5) {
          isSwiping.current = true;

          Animated.timing(translateX, {
            toValue: -width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            changeIndex(1);
            translateX.setValue(0);
            isSwiping.current = false;
          });

        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const translateCarousel = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [-width * 2, -width, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Avatar</Text>

      <View style={styles.previewBox}>
        <Animated.View
          style={{
            flexDirection: "row",
            width: width * 3,
            height: "100%",
            transform: [{ translateX: translateCarousel }],
          }}
          {...panResponder.panHandlers}
        >
          <View style={{ width }}>
            <WebView
              ref={prevRef}
              source={{ html: previewHTML }}
              onLoad={() => setReady(r => ({ ...r, prev: true }))}
            />
          </View>

          <View style={{ width }}>
            <WebView
              ref={currentRef}
              source={{ html: previewHTML }}
              onLoad={() => setReady(r => ({ ...r, current: true }))}
            />
          </View>

          <View style={{ width }}>
            <WebView
              ref={nextRef}
              source={{ html: previewHTML }}
              onLoad={() => setReady(r => ({ ...r, next: true }))}
            />
          </View>
        </Animated.View>

        <Text style={styles.nameOverlay}>{current.name}</Text>
      </View>

      <Text
        style={styles.applyBtn}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/avatar",
            params: { avatar: current.file },
          })
        }
      >
        Apply
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbee",
    padding: 15,
    paddingTop: 35,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  previewBox: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
    marginVertical: 10,
  },

  nameOverlay: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    fontWeight: "bold",
  },

  applyBtn: {
    textAlign: "center",
    backgroundColor: "#50b9b6",
    padding: 15,
    borderRadius: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});