import wordsData from "@/data/words.json";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const { height } = Dimensions.get("window");

interface LetterCircle {
  id: number;
  letter: string;
  selected: boolean;
  used: boolean;
}

export default function GameScreen() {
  const router = useRouter();
  const [letters, setLetters] = useState<LetterCircle[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [targetWord, setTargetWord] = useState("");
  const [shakeAnim] = useState(new Animated.Value(0));

  const resetGame = useCallback(() => {
    setScore(0);
    setFoundWords([]);
    setTimeLeft(60);
    setGameActive(true);
    setSelectedLetters([]);
    generateLetters();
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetGame();
    }, [resetGame])
  );

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameActive]);

  const generateLetters = () => {
    const words = wordsData.en.words;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setTargetWord(randomWord);

    const wordLetters = randomWord.split("");

    const shuffledLetters = [...wordLetters];
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledLetters[i], shuffledLetters[j]] = [
        shuffledLetters[j],
        shuffledLetters[i],
      ];
    }

    const newLetters: LetterCircle[] = shuffledLetters.map((letter, index) => ({
      id: index,
      letter,
      selected: false,
      used: false,
    }));

    setLetters(newLetters);
    setSelectedLetters([]);
  };

  const handleLetterPress = (id: number) => {
    if (letters[id].used) return;

    if (letters[id].selected) {
      const newSelectedLetters = selectedLetters.filter(
        (letterId) => letterId !== id
      );
      setSelectedLetters(newSelectedLetters);

      setLetters(
        letters.map((l) => (l.id === id ? { ...l, selected: false } : l))
      );
      return;
    }

    if (selectedLetters.length >= 5) return;

    const newSelectedLetters = [...selectedLetters, id];
    setSelectedLetters(newSelectedLetters);

    const word = newSelectedLetters.map((i) => letters[i].letter).join("");

    setLetters(
      letters.map((l) => (l.id === id ? { ...l, selected: true } : l))
    );

    if (newSelectedLetters.length === 5) {
      checkWord(word, newSelectedLetters);
    }
  };

  const checkWord = (word: string, letterIds: number[]) => {
    const words = wordsData.en.words;
    if (
      words.includes(word.toUpperCase()) &&
      !foundWords.includes(word.toUpperCase())
    ) {
      setScore(score + word.length);
      setFoundWords([...foundWords, word.toUpperCase()]);
      setTimeLeft(Math.max(10, timeLeft - 5));

      setLetters(
        letters.map((l) =>
          letterIds.includes(l.id) ? { ...l, used: true, selected: false } : l
        )
      );

      setTimeout(() => {
        generateLetters();
      }, 500);
    } else {
      shake();
    }
  };

  const resetSelection = () => {
    setSelectedLetters([]);
    setLetters(letters.map((l) => ({ ...l, selected: false })));
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      resetSelection();
    }, 200);
  };

  const endGame = () => {
    setGameActive(false);
    const possibleWords = wordsData.en.words.filter((word) => {
      const wordLetters = word.split("");
      const targetLetters = targetWord.split("");
      return (
        wordLetters.length === 5 &&
        wordLetters.every((letter, index) => targetLetters.includes(letter))
      );
    });

    router.push({
      pathname: "/(tabs)/results",
      params: {
        score,
        foundWords: foundWords.join(","),
        possibleWords: possibleWords.slice(0, 10).join(","),
        targetWord,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>

      <View style={styles.timerContainer}>
        <Text style={styles.shakeText}>Shake to reset</Text>
      </View>

      <Animated.View
        style={[
          styles.lettersContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        {[0, 1, 2, 3, 4].map((index) => {
          const letterIndex = selectedLetters[index];
          const hasLetter = letterIndex !== undefined;

          return (
            <View
              key={`slot-${index}`}
              style={[
                styles.letterCircle,
                hasLetter
                  ? styles.letterCircleSelected
                  : styles.lastLetterCircle,
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  hasLetter && styles.letterTextSelected,
                ]}
              >
                {hasLetter ? letters[letterIndex]?.letter : ""}
              </Text>
            </View>
          );
        })}
      </Animated.View>

      <View style={styles.centerCircleContainer}>
        {/* SVG Timer Circle - acts as border */}
        <Svg width={240} height={240} style={styles.timerSvg}>
          {/* Background circle */}
          <Circle
            cx="120"
            cy="120"
            r="115"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
            fill="none"
          />
          {/* Timer progress circle */}
          <Circle
            cx="120"
            cy="120"
            r="115"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${(timeLeft / 60) * 722.6} 722.6`}
            strokeLinecap="round"
            transform="rotate(-90 120 120)"
          />
        </Svg>
        <View style={styles.centerCircle}>
          <View style={styles.rowLetters}>
            <Pressable
              onPress={() => {
                handleLetterPress(0);
              }}
              style={[
                styles.letterCircle,
                letters[0] && letters[0]?.selected
                  ? styles.letterCircleSelected
                  : styles.lastLetterCircle,
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  letters[0] &&
                    letters[0]?.selected &&
                    styles.letterTextSelected,
                ]}
              >
                {letters[0]?.letter}
              </Text>
            </Pressable>
          </View>
          <View style={styles.rowLetters}>
            {letters.slice(1, 4).map((letter) => (
              <Pressable
                key={letter.id}
                onPress={() => handleLetterPress(letter.id)}
                style={[
                  styles.letterCircle,
                  letter.selected
                    ? styles.letterCircleSelected
                    : styles.lastLetterCircle,
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    letter.selected && styles.letterTextSelected,
                  ]}
                >
                  {letter.letter}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.rowLetters}>
            <Pressable
              onPress={() => handleLetterPress(4)}
              style={[
                styles.letterCircle,
                letters[4] && letters[4]?.selected
                  ? styles.letterCircleSelected
                  : styles.lastLetterCircle,
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  letters[4] &&
                    letters[4]?.selected &&
                    styles.letterTextSelected,
                ]}
              >
                {letters[4]?.letter}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.bottomLettersContainer}>
        <Pressable onPress={shake} style={styles.resetButton}>
          <Text style={styles.resetText}>↻ Reset Selection</Text>
        </Pressable>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.foundWordsText}>
          Words Found: {foundWords.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B5A",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
  },
  timerContainer: {
    position: "absolute",
    top: 100,
    width: "100%",
    alignItems: "center",
  },
  timerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  timerText: {
    color: "#FF6B5A",
    fontSize: 24,
    fontWeight: "bold",
  },
  shakeText: {
    color: "white",
    fontSize: 14,
  },
  lettersContainer: {
    position: "absolute",
    top: 240,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 10,
  },
  letterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#9B8FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  lastLetterCircle: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "white",
  },
  letterCircleSelected: {
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#9B8FFF",
  },
  letterCircleUsed: {
    opacity: 0.3,
  },
  letterText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  letterTextSelected: {
    color: "#9B8FFF",
  },
  centerCircleContainer: {
    position: "absolute",
    top: height * 0.5,
    width: "100%",
    alignItems: "center",
  },
  timerSvg: {
    position: "absolute",
    top: -20,
    left: "50%",
    marginLeft: -120,
  },
  centerCircle: {
    borderRadius: 999999,
    padding: 4,
    gap: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircleText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  bottomLettersContainer: {
    position: "absolute",
    bottom: 150,
    width: "100%",
    alignItems: "center",
  },
  resetButton: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  resetText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
  scoreText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  foundWordsText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  rowLetters: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
