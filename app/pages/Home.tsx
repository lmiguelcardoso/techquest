import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCharacter } from '../context/CharacterContext';
import { useDungeon } from '../context/DungeonContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { userHeight } from '../shared/constants';
import { Dungeon } from '../shared/entities/dungeon';
import { getDungeonsByRace } from '../shared/services/RequestService';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const { handleLogout } = useAuth();
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const { character, fetchCharacter } = useCharacter();
  const { setDungeon } = useDungeon();
  const navigation = useNavigation<NavigationProps>();

  const loadDungeons = async () => {
    const fetchedDungeons = await getDungeonsByRace(character!.race_id);
    setDungeons(fetchedDungeons);
  };

  useEffect(() => {
    if (!character) {
      fetchCharacter();
    }
  }, [character]);

  useEffect(() => {
    if (character) {
      loadDungeons();
    }
  }, [character]);

  const renderDungeonItem = ({ item }: { item: Dungeon }) => (
    <TouchableOpacity
      style={styles.dungeonCard}
      onPress={() => {
        setDungeon(item);
        navigation.navigate('Topic', {
          dungeonId: item.id,
        });
      }}
    >
      <Text style={styles.dungeonTitle}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Minimum Level: {item.min_level}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Button title="Logout" onPress={handleLogout} />
      <FlatList
        data={dungeons}
        renderItem={renderDungeonItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No dungeons available.</Text>}
      />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: userHeight,
    padding: 20,
  },
  dungeonCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  dungeonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
