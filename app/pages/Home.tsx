import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
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
  const { handleLogout } = useAuth();
  const { userData } = useAuth();

  const { character, fetchCharacter, race } = useCharacter();
  const { setDungeon } = useDungeon();
  const { setCharacter } = useCharacter();
  const navigation = useNavigation<NavigationProps>();

  const logout = () => {
    setCharacter(null);
    setDungeon(null);
    handleLogout();
  };

  const handleNavigate = (topic_id: string) => {
    navigation.navigate('Quiz', { topic_id: topic_id });
  };

  const loadDungeon = async () => {
    const actualDungeon = await getUserProgressById(userData!.id);
    const dungeon = actualDungeon[0].dungeon;
    setCurrentDungeon(dungeon);
    await loadTopics(dungeon.id);
  };

  const loadTopics = async (dungeonId: string) => {
    const topics = await getTopicsByDungeonID(dungeonId, userData!.id);
    console.log(topics);
    setTopics(topics);
  };

  useEffect(() => {
    if (!character) {
      fetchCharacter();
    }
  }, [character]);

  useEffect(() => {
    if (character) {
      loadDungeon();
    }
  }, [character]);

  return (
    <View style={styles.container}>
      {currentDungeon != null && (
        <View style={styles.header}>
          <View>
            <Text style={styles.module}>{race?.role} - Módulo 01</Text>
            <Text style={styles.title}>{currentDungeon.name}</Text>
          </View>
        </View>
      )}

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
            <Text style={styles.starCount}>6 / 30</Text>
          </View>
        </View>
      </View>
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
            <>
              <View
                style={[
                  styles.battleIconContainer,
                  BATTLE_POSITIONS[index],
                  topic.completed && {
                    top: BATTLE_POSITIONS[index].top - 24,
                  },
                ]}
              >
                <BattleIcon
                  onPress={() => handleNavigate(topic.id)}
                  status={topic.completed ? 'completed' : 'active'}
                />
              </View>
            </>
          ))}
        </ScrollView>
      </ImageBackground>

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0C5C',
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
});
