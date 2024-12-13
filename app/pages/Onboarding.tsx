import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Background from '../components/Background';
import { useAuth } from '../context/AuthContext';
import color from '../shared/color';
import fontSize from '../shared/font-size';
import {
  createFirstCharacter,
  getRaces,
} from '../shared/services/RequestService';

interface Race {
  race_id: number;
  name: string;
  role: string;
  icon: string;
  color: string;
  'background-image': string;
  description: {
    title: string;
    subtitle: string;
    description: string;
  };
}

export default function Onboarding() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const { userData, setIsFirstAccess } = useAuth();
  const [races, setRaces] = useState<Race[] | null>(null);

  const handleSelectRace = (race: Race) => {
    setSelectedRace(race);
  };

  const handleConfirmSelection = async () => {
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
        console.log(fetchedRaces[0]['background-image']);
        setRaces(fetchedRaces);
      }
    } catch (error) {
      console.error('Erro ao carregar raças:', error);
    }
  };

  const returnToRaceList = () => {
    setSelectedRace(null);
  };

  useEffect(() => {
    loadRaces();
  }, []);

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
                  style={[
                    styles.raceCard,
                    { backgroundColor: race.color },
                    selectedRace?.name === race.name && styles.selected,
                  ]}
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

      {selectedRace && (
        <ImageBackground
          resizeMode="cover"
          source={{ uri: selectedRace['background-image'] }}
          style={styles.imageBackground}
        >
          <TouchableOpacity
            style={styles.exitButton}
            onPress={returnToRaceList}
          >
            <Text style={styles.exitButtonText}>Sair</Text>
          </TouchableOpacity>
          <Text style={styles.selectionText}>
            Você escolheu: {selectedRace.name}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Confirmar Seleção"
              onPress={handleConfirmSelection}
              disabled={!selectedRace}
            />
          </View>
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
  selected: {
    borderWidth: 3,
    borderColor: '#FFD700', // Cor de destaque para a seleção
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: fontSize.secondary,
    color: '#FFF',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
});
