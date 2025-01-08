import { supabase } from '@/lib/supabase';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Navbar from '../components/Navbar';
import { useCharacter } from '../context/CharacterContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import { EquippedItem } from '../shared/entities/equipped-item';
import { Item } from '../shared/entities/item';
import fontSize from '../shared/font-size';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Inventory'>;

const ItemSlots = [
  {
    name: 'Capacete',
    type: 'head',
    icon: require('../../assets/images/inventory/head.png'),
  },
  {
    name: 'Colar',
    type: 'necklace',
    icon: require('../../assets/images/inventory/necklace.png'),
  },
  {
    name: 'Peitoral',
    type: 'chest',
    icon: require('../../assets/images/inventory/chest.png'),
  },
  {
    name: 'Arma',
    type: 'weapon',
    icon: require('../../assets/images/inventory/sword.png'),
  },
  {
    name: 'Calça',
    type: 'legs',
    icon: require('../../assets/images/inventory/legs.png'),
  },
  {
    name: 'Botas',
    type: 'boots',
    icon: require('../../assets/images/inventory/boots.png'),
  },
];
type ItemSlot = (typeof ItemSlots)[number];

export default function InventoryScreen() {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ItemSlot>(ItemSlots[0]);
  const { race, character, equippedItems, equipItem, unequipItem } =
    useCharacter();
  const navigator = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar todos os itens do inventário
        const { data: inventory, error: inventoryError } = await supabase
          .from('inventory')
          .select(
            `*,
            items ( id, name, description, bonus, icon, type )`
          )
          .eq('character_id', character?.id);

        if (inventoryError) {
          console.error('Erro ao buscar inventário:', inventoryError);
          return;
        }

        const inventoryItem: Item[] = (inventory || []).map((entry) => ({
          bonus: entry.items?.bonus || '',
          description: entry.items?.description || '',
          icon: entry.items?.icon || '',
          id: entry.items?.id || '',
          name: entry.items?.name || '',
          type: entry.items?.type || '',
        }));

        setInventoryItems(inventoryItem);
      } catch (err) {
        console.error('Erro inesperado ao buscar dados:', err);
      }
    };

    fetchData();
  }, [character?.id]);

  const handleEquipItem = async (itemId: string, slot: string) => {
    try {
      await equipItem(itemId, slot);
      setInventoryItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Erro inesperado ao equipar item:', err);
    }
  };

  const handleLongPress = async (equippedItem: EquippedItem) => {
    try {
      await unequipItem(equippedItem);

      setInventoryItems((prev) => [
        ...prev,
        {
          id: equippedItem.items?.id || '',
          name: equippedItem.items?.name || '',
          description: equippedItem.items?.description || '',
          bonus: equippedItem.items?.bonus || '',
          icon: equippedItem.items?.icon || '',
          type: equippedItem.items!.type,
        },
      ]);
    } catch (err) {
      console.error('Erro ao desequipar item:', err);
    }
  };

  useEffect(() => {
    setInventoryItems((prevInventory) =>
      prevInventory.filter(
        (inventoryItem) =>
          !equippedItems.some(
            (equippedItem) => equippedItem.item_id === inventoryItem.id
          )
      )
    );
  }, [equippedItems]);

  const calculateAttributes = () => {
    const baseAttributes = {
      health: 0,
      armor: 0,
      damage: 0,
      strength: 0,
      luck: 0,
    };

    return equippedItems.reduce((attributes, equippedItem) => {
      if (equippedItem.items?.bonus) {
        const bonuses = JSON.parse(equippedItem.items.bonus);

        return {
          health: attributes.health + (bonuses.health || 0),
          armor: attributes.armor + (bonuses.armor || 0),
          damage: attributes.damage + (bonuses.damage || 0),
          strength: attributes.strength + (bonuses.strength || 0),
          luck: attributes.luck + (bonuses.luck || 0),
        };
      }
      return attributes;
    }, baseAttributes);
  };
  const returnToHome = () => {
    navigator.goBack();
  };
  const attributes = calculateAttributes();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Inventário</Text>
        <TouchableOpacity style={styles.exitButton} onPress={returnToHome}>
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarContainerSection1}>
          <Image source={{ uri: race?.icon }} style={styles.avatar} />

          <View style={styles.attributesContainer}>
            <Text style={styles.attributesTitle}>Atributos</Text>
            <View style={styles.attributeRow}>
              <Text style={styles.attributesLabel}>Vida:</Text>
              <Text style={styles.attributesValue}>{attributes.health}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={styles.attributesLabel}>Armadura:</Text>
              <Text style={styles.attributesValue}>{attributes.armor}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={styles.attributesLabel}>Dano:</Text>
              <Text style={styles.attributesValue}>{attributes.damage}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={styles.attributesLabel}>Força:</Text>
              <Text style={styles.attributesValue}>{attributes.strength}</Text>
            </View>
            <View style={styles.attributeRow}>
              <Text style={styles.attributesLabel}>Sorte:</Text>
              <Text style={styles.attributesValue}>{attributes.luck}</Text>
            </View>
          </View>
        </View>

        <View style={styles.slots}>
          <Text style={styles.raceName}>{race?.name}</Text>
          <FlatList
            style={styles.inventorySlots}
            data={ItemSlots}
            numColumns={2}
            keyExtractor={(item) => item.type}
            renderItem={({ item, index }) => {
              const equippedItem = equippedItems.find(
                (equipped) => equipped.items!.type === item.type
              );
              return (
                <TouchableOpacity
                  key={item.type}
                  style={styles.slot}
                  onPress={() => setSelectedSlot(ItemSlots[index])}
                  onLongPress={() =>
                    equippedItem && handleLongPress(equippedItem)
                  }
                >
                  <Image
                    source={
                      equippedItem?.items?.icon
                        ? { uri: equippedItem.items.icon }
                        : item.icon
                    }
                    style={styles.slotImage}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.inventoryContainer}>
        <Text style={styles.inventoryTitle}>{selectedSlot.name}</Text>
        <FlatList
          data={inventoryItems.filter(
            (item) => item.type === selectedSlot.type
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.inventoryItem}>
              <Image source={{ uri: item.icon }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemEffect}>{item.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.equipButton}
                onPress={() => handleEquipItem(item.id, selectedSlot.type)}
              >
                <Text style={styles.equipButtonText}>Equipar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <Navbar />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#580068', padding: 16, gap: 20 },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  titleContainer: {
    backgroundColor: color.white,
    alignContent: 'center',
    borderRadius: 10,
  },
  title: {
    color: color.primary,
    textAlign: 'center',
    fontSize: fontSize.primary,
    fontWeight: 'bold',
  },
  avatarContainerSection1: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginVertical: 16,
    borderWidth: 1,
  },
  slots: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align to bottom
  },
  slot: {
    width: 50,
    height: 50,
    margin: 15,
    backgroundColor: '#3A3A66',
    borderRadius: 8,
  },
  slotImage: { width: '100%', height: '100%' },
  inventoryContainer: { flex: 1 },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A66',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemImage: { width: 50, height: 50, marginRight: 8 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  itemEffect: { fontSize: 14, color: '#BBB' },
  equipButton: {
    backgroundColor: '#5DADE2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  equipButtonText: { color: '#FFF', fontWeight: 'bold' },
  attributesContainer: {
    backgroundColor: color.primary, // Roxo como no fundo da imagem
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    gap: 2,
    width: 200, // Ajustar conforme necessário
  },
  attributesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Branco para contraste
    marginBottom: 5,
  },
  attributesLabel: {
    fontSize: 14,
    flex: 5,
    color: '#FFFFFF',
    justifyContent: 'center',
    marginBottom: 5,
  },
  attributesValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 3,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 10,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: color.white,
    borderRadius: 10,
  },
  inventorySlots: {
    width: '100%',
    marginTop: '25%',
  },
  raceName: {
    fontSize: 34,
    fontWeight: 'bold',
    color: color.primary,
    marginTop: 20,
  },
  exitButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
