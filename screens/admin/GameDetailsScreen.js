import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import CopyCard from "../../components/UI/CopyCard";

const GameDetailsScreen = ({navigation}) => {
  const gameId = useSelector((state) => state.games.activeGame);
  const game = useSelector((state) =>
    state.games.ownedGames.find((game) => game.id === gameId)
  );

  useEffect(() => {
    navigation.setParams({gameId: gameId})
  }, [gameId])

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Nazwa gry</Text>
        <Text style={styles.title}>{game.name}</Text>
        <Text style={styles.label}>Opis</Text>
        <Text style={styles.description}>{game.description}</Text>
      </View>
      <View>
        <CopyCard copyText={game.id}>
            <Text style={styles.idTitle}>Identyfikator gry</Text>
          <Text style={styles.id}>{game.id}</Text>
        </CopyCard>
      </View>
    </View>
  );
};

GameDetailsScreen.navigationOptions = (navData) => {
  const gameId = navData.navigation.getParam("gameId");
  return {
    headerTitle: "Szczegóły gry",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Dodaj"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("GameEdit", {gameId: gameId});
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: "#aaa",
  },
  idTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GameDetailsScreen;
