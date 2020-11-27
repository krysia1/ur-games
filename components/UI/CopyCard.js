import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Clipboard,
} from "react-native";

const Card = ({ children, style, copyText }) => {
  const copyToClipboard = () => {
    Clipboard.setString(copyText);
  };

  return (
    <View style={{ ...styles.card, ...style }}>
      <View style={styles.touchable}>
        <TouchableOpacity onPress={copyToClipboard}>
          <View style={styles.details}>
            {children}
            <Text style={styles.info}>Dotknij aby skopiować do schowka</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // shadowColor: 'black',
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    height: 90,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  touchable: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  info: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default Card;
