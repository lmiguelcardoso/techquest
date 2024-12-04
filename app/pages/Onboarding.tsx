import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import color from '../shared/color';
import fontSize from '../shared/font-size';
import { createFirstCharacter } from '../shared/services/RequestService';

const races = [
  {
    id: 1,
    name: 'Orc',
    role: 'Backend',
    color: '#D35400',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB4bHbUuyJGSKsBwH8vzcmVtKqJhVx1vLK6w&s',
    },
  },
  {
    id: 2,
    name: 'Elfo',
    role: 'Frontend',
    color: '#2980B9',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB4bHbUuyJGSKsBwH8vzcmVtKqJhVx1vLK6w&s',
    },
  },
  {
    id: 3,
    name: 'Anão',
    role: 'DevOps',
    color: '#27AE60',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB4bHbUuyJGSKsBwH8vzcmVtKqJhVx1vLK6w&s',
    },
  },
  {
    id: 4,
    name: 'Fada',
    role: 'Designer',
    color: '#FFCBDB',
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB4bHbUuyJGSKsBwH8vzcmVtKqJhVx1vLK6w&s',
    },
  },
];

export default function Onboarding() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const { userData, setIsFirstAccess } = useAuth();
  const handleSelectRace = (race: string) => {
    setSelectedRace(race);
  };

  const handleConfirmSelection = async () => {
    if (selectedRace) {
      const race = races.find((r) => r.name == selectedRace)!;
      await createFirstCharacter(userData!, race?.id);
      setIsFirstAccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: fontSize.primary }]}>
        Bem vindo ao TechQuest
      </Text>
      <Text style={[styles.subtitle, { fontSize: fontSize.secondary }]}>
        Selecione sua raça
      </Text>

      <View style={styles.raceContainer}>
        {races.map((race) => (
          <TouchableOpacity
            key={race.name}
            style={[
              styles.raceCard,
              { backgroundColor: race.color },
              selectedRace === race.name && styles.selected,
            ]}
            onPress={() => handleSelectRace(race.name)}
          >
            <Image source={race.image} style={styles.raceImage} />
            <Text style={styles.raceName}>{race.name}</Text>
            <Text style={styles.raceRole}>{race.role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedRace && (
        <>
          <Text style={styles.selectionText}>
            Você escolheu: {selectedRace}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Confirmar Seleção"
              onPress={handleConfirmSelection}
              disabled={!selectedRace}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: color.white,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  raceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  raceCard: {
    borderRadius: 10,
    height: 150,
    justifyContent: 'center',
    width: '45%',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
  raceImage: {
    borderRadius: 30,
    height: 60,
    marginBottom: 10,
    width: 60,
  },
  raceName: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  raceRole: {
    color: color.white,
    fontSize: 14,
    textAlign: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  selectionText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: fontSize.secondary,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
});
