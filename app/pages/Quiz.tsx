import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCharacter } from '../context/CharacterContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import {
  fetchQuestionsWithAnswers,
  fetchTopic,
} from '../shared/services/RequestService';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Quiz'>;

export default function Quiz() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();

  const { topic_id } = route.params as { topic_id: string };

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);

  const [enemyLives, setEnemyLives] = useState(0);
  const { race, attributes, playerLife, setPlayerLife, totalLife } =
    useCharacter();

  const [topic, setTopic] = useState<any | null>(null);

  // Fetch Questions and Answers
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const topicData = await fetchTopic(topic_id);
        setTopic(topicData);

        const data = await fetchQuestionsWithAnswers(topic_id);

        if (data.length === 0) {
          setError('Nenhuma pergunta encontrada.');
        } else {
          setQuestions(data);
          setLoading(false);
          setEnemyLives(data.length);
          console.log('total life', totalLife);
          console.log('player life', playerLife);
        }
      } catch (err) {
        setError('Erro ao carregar perguntas');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [topic_id]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setEnemyLives((prev) => Math.max(prev - 1, 0));
    } else {
      setPlayerLife((prev) => {
        const newLife = Math.max(prev - 1, 0);
        if (newLife === 0) {
          setIsGameOverModalVisible(true);
        }
        return newLife;
      });
    }

    // Only proceed to next question if player has lives remaining
    if (playerLife > 1 && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    }
  };
  const renderLifeBar = (lives: number, totalLives: number, flex: boolean) => {
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
              flex && styles.flex,
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
        <Text style={styles.lifeLabel}>{topic?.enemy.name}</Text>
        {renderLifeBar(enemyLives, questions.length, false)}
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <Image
        style={styles.enemyImage}
        source={{
          uri: topic?.enemy.image,
        }}
      />

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.text}</Text>
        {question.answers.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option.is_correct)}
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

        {renderLifeBar(playerLife, totalLife, true)}
      </View>

      <Text style={styles.attributes}>
        Attributes: {attributes.damage} {attributes.armor} {attributes.luck}{' '}
        {attributes.armor}
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <AntDesign name="warning" size={76} color="white" />
            <Text style={styles.modalText}>
              Se você sair irá perder todo o progresso dessa Quest
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(!isModalVisible)}
              >
                <Text style={styles.textStyle}>Continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setModalVisible(!isModalVisible);
                  navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isGameOverModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <AntDesign name="warning" size={76} color="white" />
            <Text style={styles.modalText}>Você perdeu!</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>Voltar para a tela incial</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flex: 1,
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
    paddingHorizontal: 10,
    gap: 10,
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
  exitBtn: { position: 'absolute', top: 0, right: 0 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: color.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.white,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: 'flex',
    gap: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    color: color.white,
  },
  modalButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: color.white,
    borderRadius: 5,
    padding: 10,
    minWidth: '100%',
  },
  buttonConfirm: {
    backgroundColor: '#7B0404',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22,
  },
  attributes: {
    fontSize: 16,
    marginTop: 10,
    color: color.white,
    textAlign: 'center',
  },
  flex: { flex: 1 },
});
