import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import color from '../shared/color';

type Params = {
  status: 'active' | 'completed' | 'locked';
  stars?: number;
};

export default function BattleIcon({ status, stars = 3 }: Params) {
  let iconColor = '#3D3C3C';
  if (status === 'active') iconColor = '#FF0000';
  if (status === 'completed') iconColor = '#FF0000';

  return (
    <View>
      {status === 'active' && (
        <AntDesign
          style={styles.currentDungeonArrow}
          name="arrowright"
          size={24}
          color="#FF0000"
        />
      )}

      <TouchableOpacity
        disabled={status == 'locked' || status == 'completed'}
        style={[styles.iconContainer, { backgroundColor: iconColor }]}
      >
        {(status === 'completed' || status === 'active') && (
          <>
            <View style={[styles.star, styles.topStar]}>
              <FontAwesome
                name="star"
                size={24}
                color={status == 'completed' && stars >= 1 ? 'yellow' : '#CCC'}
              />
            </View>

            <View style={[styles.star, styles.leftStar]}>
              <FontAwesome
                name="star"
                size={24}
                color={status == 'completed' && stars >= 2 ? 'yellow' : '#CCC'}
              />
            </View>

            <View style={[styles.star, styles.rightStar]}>
              <FontAwesome
                name="star"
                size={24}
                color={status == 'completed' && stars >= 3 ? 'yellow' : '#CCC'}
              />
            </View>
          </>
        )}

        <MaterialCommunityIcons name="sword-cross" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 45,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderColor: color.white,
    borderWidth: 1.5,
    position: 'relative',
  },
  star: {
    position: 'absolute',
  },
  topStar: {
    top: -30,
    left: '50%',
    marginLeft: -10,
  },
  leftStar: {
    top: -15,
    left: -15,
  },
  rightStar: {
    top: -15,
    right: -15,
  },
  currentDungeonArrow: {
    bottom: -45,
    left: -30,
  },
});
