import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Background from '../components/Background';
import ButtonPrimary from '../components/ButtonPrimary';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import color from '../shared/color';
import { Race } from '../shared/entities/race';
import fontSize from '../shared/font-size';
import {
  createFirstCharacter,
  getRaces,
} from '../shared/services/RequestService';

const slides = [
  {
    id: 1,
    title: 'Impulsione seus estudos em tecnologia!',
    description:
      'De forma descomplicada evolua seus conhecimentos por meio de Quests desafiadoras.',
  },
  {
    id: 2,
    title: 'Evolua seu Personagem!',
    description:
      'Conforme avança na sua jornada de aprendizado ganhe itens derrotando monstros perigosos.',
  },
  {
    id: 3,
    title: 'Diferentes trilhas de Aprendizado!',
    description:
      'Altere entre classes de personagens de acordo com o seu objetivo de aprendizado.',
  },
];

export default function Onboarding() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const { userData, setIsFirstAccess } = useAuth();
  const [races, setRaces] = useState<Race[] | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const checkWalkthrough = async () => {
    try {
      const hasCompletedWalkthrough = await AsyncStorage.getItem(
        'walkthroughCompleted'
      );
      if (hasCompletedWalkthrough === 'true') {
        setShowWalkthrough(false);
      }
    } catch (error) {
      console.error('Error checking walkthrough status:', error);
      setShowWalkthrough(true);
    }
  };

  const handleSelectRace = (race: Race) => {
    setSelectedRace(race);
    setIsImageLoaded(false);
  };

  const handleConfirmSelection = async () => {
    if (selectedRace?.race_id != 2) {
      Alert.alert('Erro', 'Raça não possui conteudo cadastrado');
      return;
    }

    try {
      if (selectedRace && races != null) {
        const race = races.find((r) => r.name === selectedRace.name)!;
        await createFirstCharacter(userData!, race.race_id);
        setIsFirstAccess(false);
      }
    } catch (error) {
      console.error('Erro ao confirmar seleção:', error);
    }
  };

  const loadRaces = async () => {
    try {
      const fetchedRaces = await getRaces();
      if (fetchedRaces && fetchedRaces.length > 0) {
        setRaces(fetchedRaces);
      }
    } catch (error) {
      console.error('Erro ao carregar raças:', error);
    }
  };

  const returnToRaceList = () => {
    setSelectedRace(null);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      fadeOut();
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        fadeIn();
      }, 500);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      fadeOut();
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        fadeIn();
      }, 500);
    }
  };
  const handleComplete = async () => {
    await AsyncStorage.setItem('walkthroughCompleted', 'true');
    setShowWalkthrough(false);
  };

  useEffect(() => {
    checkWalkthrough();
    loadRaces();
  }, []);

  if (showWalkthrough) {
    return (
      <Background>
        <View style={styles.welcomeContainer}>
          <Text style={{ ...styles.welcomeText }}>Bem vindo!</Text>
          <View style={styles.centralizeImg}>
            <Image source={require('../../assets/images/icon.png')} />
          </View>
        </View>

        <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
          <Text style={styles.walkthroughTitle}>
            {slides[currentIndex].title}
          </Text>
          <Text style={styles.walkthroughDescription}>
            {slides[currentIndex].description}
          </Text>

          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </Animated.View>

        <View
          style={[
            styles.buttonContainerWalkthough,
            currentIndex == 0 && styles.justifyEnd,
          ]}
        >
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
            </Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  if (!races) {
    return (
      <Background>
        <Text style={styles.title}>Carregando raças...</Text>
      </Background>
    );
  }

  return (
    <>
      {!selectedRace && (
        <>
          <View style={styles.alignCenter}>
            <View style={styles.raceContainer}>
              <Text style={styles.title}>
                Escolha sua trilha de conhecimento
              </Text>
              {races.map((race) => (
                <TouchableOpacity
                  key={race.name}
                  style={[styles.raceCard, { backgroundColor: race.color }]}
                  onPress={() => handleSelectRace(race)}
                >
                  <Image
                    source={{
                      uri: race.icon,
                    }}
                    style={styles.raceImage}
                  />
                  <Text style={styles.raceName}>{race.name}</Text>
                  <Text style={styles.raceRole}>{race.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {selectedRace != null && (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: selectedRace['background-image'] }}
          style={styles.imageBackground}
          onLoad={() => setIsImageLoaded(true)}
        >
          {!isImageLoaded ? (
            <Loader />
          ) : (
            <View style={styles.raceDetailContainer}>
              <View style={styles.raceDescription}>
                <View>
                  <Text style={styles.title}>{selectedRace.name}</Text>
                  <Text style={styles.title}>{selectedRace.role}</Text>
                </View>
                <TouchableOpacity
                  style={styles.exitButton}
                  onPress={returnToRaceList}
                >
                  <AntDesign
                    style={styles.exitButtonText}
                    name="close"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.overlay}>
                <Text style={styles.description}>
                  {selectedRace.description.title}
                </Text>
                <Text style={styles.subtitle}>Trilha de aprendizagem:</Text>
                {selectedRace.description.description
                  .split('#')
                  .map((description: string) => (
                    <>
                      <Text style={styles.list}>• {description}</Text>
                    </>
                  ))}

                <View style={styles.buttonContainer}>
                  <ButtonPrimary
                    style={styles.btnConfirmSelection}
                    onPress={handleConfirmSelection}
                  >
                    <Text>Aceitar</Text>
                  </ButtonPrimary>
                </View>
              </View>
            </View>
          )}
        </ImageBackground>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  alignCenter: {
    backgroundColor: '#580068',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    color: color.white,
    fontSize: fontSize.primary,
    fontWeight: 'bold',
  },
  raceContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  raceCard: {
    borderRadius: 10,
    justifyContent: 'center',
    width: '45%',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
  raceImage: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  raceName: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  raceRole: {
    color: color.white,
    fontSize: 14,
    textAlign: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    width: 50,
    height: 50,
    left: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  raceDetailContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 20,
  },
  raceDescription: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  overlay: {
    width: '100%',
    backgroundColor: 'rgba(60, 0, 90, 0.50)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  description: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 25,
    textAlign: 'center',
  },
  list: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 4,
  },
  btnConfirmSelection: {
    height: 45,
    width: 150,
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },

  slideContainer: {
    width: '100%',
    height: '40%',
    padding: 20,
    backgroundColor: '#580068',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centralizeImg: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    color: color.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 50,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: color.white,
  },
  buttonContainerWalkthough: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.white,
    backgroundColor: '#580068',
  },
  buttonText: {
    color: color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  walkthroughTitle: {
    fontSize: 24,
    textAlign: 'center',
    color: color.white,
    fontWeight: 'bold',
  },
  walkthroughDescription: {
    fontSize: 18,
    textAlign: 'center',
    color: color.white,
    fontWeight: 'normal',
  },
});
