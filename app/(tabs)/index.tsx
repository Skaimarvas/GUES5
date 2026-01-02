import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const LETTER_COLORS = ["#E57FCA", "#FF7B6B", "#5DBBF5", "#9B8FFF", "#6DD4A8"];

export default function HomeScreen() {
  const router = useRouter();

  const startGame = () => {
    router.push("/(tabs)/game");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.lettersRow}>
          {["G", "U", "E", "S", "5"].map((letter, index) => (
            <View
              key={index}
              style={[
                styles.letterCircle,
                { backgroundColor: LETTER_COLORS[index] },
              ]}
            >
              <Text style={styles.letterText}>{letter}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bestContainer}>
          <Text style={styles.bestText}>BEST</Text>
          <View style={styles.bestCircle}>
            <Text style={styles.bestNumber}>0</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.playButton, styles.button]}
          onPress={startGame}
        >
          <Text style={styles.playIcon}>▶</Text>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable style={[styles.smallButton, styles.galleryButton]}>
            <Text style={styles.buttonIcon}>🖼</Text>
          </Pressable>

          <Pressable style={[styles.smallButton, styles.statsButton]}>
            <Text style={styles.buttonIcon}>📊</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD166",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  lettersRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  letterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  bestContainer: {
    alignItems: "center",
  },
  bestText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bestCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  bestNumber: {
    color: "#FFD166",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonsContainer: {
    alignItems: "center",
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 140,
    height: 50,
    backgroundColor: "#6B69FF",
    marginBottom: 15,
  },
  playIcon: {
    color: "white",
    fontSize: 28,
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 15,
  },
  smallButton: {
    width: 60,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryButton: {
    backgroundColor: "#5DD4C8",
  },
  statsButton: {
    backgroundColor: "#9B8FFF",
  },
  buttonIcon: {
    fontSize: 24,
  },
});
