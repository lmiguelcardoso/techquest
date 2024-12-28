import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BattleIcon from '../components/BattleIcon';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCharacter } from '../context/CharacterContext';
import { useDungeon } from '../context/DungeonContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import { Dungeon } from '../shared/entities/dungeon';
import { TopicWithUserStatus } from '../shared/entities/topic';
import fontSize from '../shared/font-size';
import {
  createUserProgress,
  fetchStarsByDungeon,
  fetchTotalStars,
  getDungeonsByRace,
  getTopicsByDungeonID,
  getUserProgressById,
} from '../shared/services/RequestService';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Home'>;

const BATTLE_POSITIONS = [
  { top: 450 },
  { top: 350 },
  { top: 255, left: 255 },
  { top: 150 },
  { top: 25 },
];

export default function Home() {
  const [currentDungeon, setCurrentDungeon] = useState<Dungeon | null>(null);
  const [topics, setTopics] = useState<TopicWithUserStatus[] | null>(null);
  const [isDungeonListVisible, setDungeonListVisible] = useState(true); // Controle da visibilidade
  const [allDungeons, setAllDungeons] = useState<Dungeon[]>([]); // Novo estado para todas as dungeons
  const { handleLogout } = useAuth();
  const { userData } = useAuth();
  const { character, fetchCharacter, race } = useCharacter();
  const { setDungeon } = useDungeon();
  const { setCharacter } = useCharacter();
  const navigation = useNavigation<NavigationProps>();
  const [totalStars, setTotalStars] = useState(0);
  const [dungeonStars, setDungeonStars] = useState<{ [key: string]: number }>(
    {}
  );

  const logout = () => {
    setCharacter(null);
    setDungeon(null);
    handleLogout();
  };

  const handleNavigate = (topic_id: string) => {
    navigation.navigate('Quiz', { topic_id: topic_id });
  };

  const loadTopics = async (dungeonId: string) => {
    const topics = await getTopicsByDungeonID(dungeonId, userData!.id);

    // Define o status dos tópicos
    let activeFound = false;
    const updatedTopics = topics.map((topic, index) => {
      if (topic.completed) {
        return { ...topic, status: 'completed' };
      } else if (!activeFound) {
        activeFound = true;
        return { ...topic, status: 'active' };
      } else {
        return { ...topic, status: 'locked' };
      }
    });

    // Se nenhum tópico foi marcado como ativo, marque o primeiro tópico como ativo
    if (!activeFound && updatedTopics.length > 0 && updatedTopics.length != 1) {
      updatedTopics[0].status = 'active';
    }

    setTopics(updatedTopics);
  };

  const handleDungeonSelect = async (dungeonId: string) => {
    let userProgress = await getUserProgressById(userData!.id, dungeonId);

    if (userProgress.length === 0) {
      // Se não houver progresso, cria um novo registro
      await createUserProgress(userData!.id, dungeonId);
      userProgress = await getUserProgressById(userData!.id, dungeonId);
    }

    if (userProgress.length > 0) {
      const dungeon = userProgress[0].dungeon;
      setCurrentDungeon(dungeon);
      await loadTopics(dungeon.id);
    }

    setDungeonListVisible(false);
  };

  const handleBackToList = () => {
    setCurrentDungeon(null);
    setDungeonListVisible(true);
  };

  useEffect(() => {
    if (!character) {
      fetchCharacter();
    }
  }, [character]);

  useEffect(() => {
    const fetchAllDungeons = async () => {
      const dungeons = await getDungeonsByRace(character!.race_id);
      setAllDungeons(dungeons);
    };
    fetchAllDungeons();
  }, [character]);

  useEffect(() => {
    const fetchStars = async () => {
      const data = await fetchTotalStars(userData!.id);

      const totalStars = data.reduce(
        (acc: any, progress: any) => acc + progress.stars,
        0
      );
      setTotalStars(totalStars);

      // Fetch stars for each dungeon
      const starsByDungeon: { [key: string]: number } = {};
      for (const dungeon of allDungeons) {
        const stars = await fetchStarsByDungeon(dungeon.id, userData!.id);
        starsByDungeon[dungeon.id] = stars;
      }

      setDungeonStars(starsByDungeon);
    };

    fetchStars();
  }, [character, allDungeons]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.module}>{race?.role} - Módulo 01</Text>
          <Text style={styles.title}>{currentDungeon?.name || race?.role}</Text>
          <TouchableOpacity
            onPress={currentDungeon != null ? handleBackToList : logout}
            style={styles.headerBtn}
          >
            {currentDungeon != null ? (
              <AntDesign name="close" size={30} color="black" />
            ) : (
              <MaterialIcons name="logout" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.characterIconContainer}>
          <Image source={{ uri: race?.icon }} style={styles.raceIcon} />
          <Text>{race?.name}</Text>
        </View>

        <View style={styles.dungeonDetailContainer}>
          <Text style={styles.battleText}>Batalha 03/10</Text>
          <View style={styles.starContainer}>
            <Text style={styles.starText}>Estrelas</Text>
            <FontAwesome name="star" size={24} color="yellow" />
            <Text style={styles.starCount}>{totalStars} / 30</Text>
          </View>
        </View>
      </View>

      {/* DungeonList */}
      {isDungeonListVisible ? (
        <View style={styles.dungeonListContainer}>
          <ScrollView contentContainerStyle={styles.dungeonScrollContainer}>
            {allDungeons.map((dungeon, index) => (
              <TouchableOpacity
                key={dungeon.id}
                onPress={() => handleDungeonSelect(dungeon.id)}
                style={styles.dungeonItem}
              >
                <Text style={styles.dungeonName}>
                  {index + 1}- {dungeon.name} - {dungeonStars[dungeon.id] || 0}{' '}
                  estrelas
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <>
          {/* TopicRoadMap */}
          <ImageBackground
            source={{
              uri: 'https://kkjssbknhoxkehweronm.supabase.co/storage/v1/object/public/global/background.png',
            }}
            imageStyle={styles.backgroundImage__img}
            style={styles.backgroundImage}
          >
            <ScrollView
              style={styles.battlePath}
              contentContainerStyle={styles.scrollContent}
            >
              {topics?.map((topic, index) => (
                <View
                  style={[
                    styles.battleIconContainer,
                    BATTLE_POSITIONS[index],
                    topic.completed && {
                      top: BATTLE_POSITIONS[index].top - 24,
                    },
                  ]}
                  key={topic.id}
                >
                  <BattleIcon
                    onPress={() => handleNavigate(topic.id)}
                    status={topic.status as any}
                  />
                </View>
              ))}
            </ScrollView>
          </ImageBackground>
        </>
      )}

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#580068',
  },
  header: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    margin: 10,
    padding: 5,
    borderRadius: 8,
  },
  module: {
    fontSize: fontSize.text,
    color: color.primary,
    fontWeight: 'semibold',
  },
  title: {
    fontSize: fontSize.secondary,
    fontWeight: 'bold',
    color: color.primary,
    marginLeft: 10,
  },
  progressContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  battleText: {
    fontSize: fontSize.primary,
    fontWeight: 'bold',
    color: '#4A0C5C',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starText: {
    fontSize: 16,
    marginRight: 5,
    color: '#4A0C5C',
  },
  starCount: {
    fontSize: 16,
    marginLeft: 5,
    color: '#4A0C5C',
  },
  battlePath: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    margin: 10,
    marginBottom: 65,
  },
  backgroundImage__img: {
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
  },
  characterIconContainer: {
    alignItems: 'center',
  },
  dungeonDetailContainer: {
    alignItems: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  battleIconContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -25,
  },
  raceIcon: { width: 100, height: 100 },
  flex: { flex: 1 },
  headerBtn: { position: 'absolute', top: 0, right: 0 },
  dungeonListContainer: {
    flex: 1,
    padding: 10,
  },
  dungeonScrollContainer: {
    alignItems: 'center',
    borderColor: color.white,
    borderWidth: 2,
    paddingVertical: 20,
    borderRadius: 10,
    gap: 10,
  },
  dungeonItem: {
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: '90%',
  },
  dungeonName: {
    fontSize: 18,
    textAlign: 'justify',
    color: color.primary,
  },
});
