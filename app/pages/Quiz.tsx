import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCharacter } from '../context/CharacterContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import { fetchQuestionsWithAnswers } from '../shared/services/RequestService';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Quiz'>;

export default function Quiz() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();

  const { topic_id } = route.params as { topic_id: string };

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [playerLife, setPlayerLife] = useState(5);
  const [enemyLives, setEnemyLives] = useState(0);
  const { race } = useCharacter();

  // Fetch Questions and Answers
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestionsWithAnswers(topic_id);

        if (data.length === 0) {
          setError('Nenhuma pergunta encontrada.');
        } else {
          setQuestions(data);
          setEnemyLives(data.length);
        }
      } catch (err) {
        setError('Erro ao carregar perguntas e respostas.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [topic_id]);

  const handleAnswer = (selectedOption: string) => {
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.answers.find((ans: any) => ans.is_correct);

    if (selectedOption === correctAnswer.text) {
      setEnemyLives((prev) => Math.max(prev - 1, 0));
    } else {
      setPlayerLife((prev) => Math.max(prev - 1, 0));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    }
  };

  const renderLifeBar = (lives: number, totalLives: number) => {
    return (
      <View style={styles.lifeBar}>
        {Array.from({ length: totalLives }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.lifeSegment,
              index < lives ? styles.activeSegment : styles.inactiveSegment,
              index == 0 && styles.firstSegment,
              index == totalLives - 1 && styles.lastSegment,
            ]}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question || !question.answers || question.answers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Sem respostas disponíveis para esta pergunta.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#D700FF', '#83009B']}
      start={{ x: 0.9, y: 0.15 }}
      end={{ x: 0.25, y: 0.55 }}
      style={{ ...styles.container }}
    >
      <View style={styles.lifeContainer}>
        <Text style={styles.lifeLabel}>Globin Batedor</Text>
        {renderLifeBar(enemyLives, questions.length)}
      </View>

      <Image
        style={styles.enemyImage}
        source={{
          uri: 'https://kkjssbknhoxkehweronm.supabase.co/storage/v1/object/public/global/troll.png?t=2024-12-19T23%3A36%3A37.664Z',
        }}
      />

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.text}</Text>
        {question.answers.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option.text)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.userLifeContainer}>
        <Image source={{ uri: race?.icon }} style={styles.raceIcon} />
        <Image
          source={{
            uri: 'https://kkjssbknhoxkehweronm.supabase.co/storage/v1/object/public/global/heart.png?t=2024-12-19T23%3A46%3A28.733Z',
          }}
          style={styles.heartIcon}
        />

        {renderLifeBar(playerLife, 5)}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  lifeContainer: {
    alignItems: 'center',
  },
  lifeLabel: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  lifeBar: {
    flexDirection: 'row',
  },
  lifeSegment: {
    width: 33,
    height: 20,
    borderColor: color.white,
    borderWidth: 2,
    borderRadius: 4,
  },
  activeSegment: {
    backgroundColor: '#FF0000',
  },
  inactiveSegment: {
    backgroundColor: '#3D3C3C',
  },
  userLifeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: color.white,
    justifyContent: 'space-evenly',
    height: 65,
  },
  raceIcon: { width: 50, height: 50 },
  heartIcon: { width: 25, height: 25 },

  firstSegment: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  lastSegment: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  questionContainer: {
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
    padding: 10,
    backgroundColor: '#580068',
    borderRadius: 10,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  question: {
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center',
    color: color.white,
    fontWeight: 'bold',
  },
  optionButton: {
    backgroundColor: color.white,
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  optionText: {
    color: color.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: { color: 'red', fontSize: 16 },
  enemyImage: { width: 'auto', height: 300, borderRadius: 20 },
});
