import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCharacter } from '../context/CharacterContext';
import { userHeight } from '../shared/constants';
import { Dungeon } from '../shared/entities/dungeon';
import { getDungeonsByRace } from '../shared/services/RequestService';

export default function Home() {
  const { handleLogout } = useAuth();
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const { character, fetchCharacter } = useCharacter();

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
    loadDungeons();
  }, []);

  const renderDungeonItem = ({ item }: { item: Dungeon }) => (
    <View style={styles.dungeonCard}>
      <Text style={styles.dungeonTitle}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Minimum Level: {item.min_level}</Text>
    </View>
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
