import { supabase } from '@/lib/supabase';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDungeon } from '../context/DungeonContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type TopicsScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;

type Props = {
  route: TopicsScreenRouteProp;
};

interface Topic {
  id: string;
  name: string;
  description: string;
}

export default function Topic({ route }: Props) {
  const { dungeonId } = route.params;
  const [topics, setTopics] = useState<Topic[]>([]);
  const { dungeon, setDungeon } = useDungeon();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('dungeon_id', dungeonId);
      if (!error) setTopics(data || []);
    };

    fetchTopics();
  }, [dungeonId]);

  useEffect(() => {
    navigation.setOptions({
      title: dungeon?.name,
    });
  }, [dungeonId, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dungeon?.name}</Text>
      <Text> {dungeon?.description}</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.topicCard}>
            <Text style={styles.topicName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topicCard: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
