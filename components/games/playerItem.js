import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Card from "../UI/Card";

const gameItem = ({ onSelect, name, acquiredPoints, totalPoints }) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.game}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={onSelect} useForeground>
          <View style={styles.details}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.name}>{acquiredPoints}/{totalPoints}</Text>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  game: {
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB'
    // marginVertical: 10,
    // marginHorizontal: 20,
  },
  touchable: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  name: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});

export default gameItem;
