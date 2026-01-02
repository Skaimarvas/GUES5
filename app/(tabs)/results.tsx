import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const score = params.score ? parseInt(params.score as string) : 0;
  const foundWordsStr = params.foundWords as string || '';
  const foundWords = foundWordsStr ? foundWordsStr.split(',') : [];
  const possibleWordsStr = params.possibleWords as string || '';
  const possibleWords = possibleWordsStr ? possibleWordsStr.split(',') : [];
  const targetWord = params.targetWord as string || '';

  const playAgain = () => {
    router.replace('/(tabs)/game');
  };

  const goHome = () => {
    router.replace('/(tabs)/explore');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.mainText}>You could have made</Text>
        <Text style={styles.targetWord}>{targetWord}</Text>
        <Text style={styles.subText}>Or other {possibleWords.length - 1} words</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>You scored</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{score}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {foundWords.length > 0 && (
        <View style={styles.foundWordsSection}>
          <Text style={styles.foundWordsTitle}>Words Found:</Text>
          {foundWords.map((word, index) => (
            <Text key={index} style={styles.foundWord}>{word}</Text>
          ))}
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.playAgainButton} onPress={playAgain}>
          <Text style={styles.playAgainIcon}>↻</Text>
          <Text style={styles.playAgainText}>PLAY AGAIN</Text>
        </Pressable>

        <View style={styles.bottomButtons}>
          <Pressable style={[styles.smallButton, styles.homeButton]} onPress={goHome}>
            <Text style={styles.buttonIcon}>🏠</Text>
          </Pressable>

          <Pressable style={[styles.smallButton, styles.shareButton]}>
            <Text style={styles.buttonIcon}>📤</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8A4FF',
    padding: 20,
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  targetWord: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    color: 'white',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: '#B8A4FF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  foundWordsSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foundWordsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foundWord: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B7FE8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  playAgainIcon: {
    color: 'white',
    fontSize: 24,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  smallButton: {
    width: 60,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    backgroundColor: '#FFB84D',
  },
  shareButton: {
    backgroundColor: '#5DD4C8',
  },
  buttonIcon: {
    fontSize: 24,
  },
});
