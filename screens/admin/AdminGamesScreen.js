import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import GameItem from "../../components/games/gameItem";
import * as gamesActions from "../../store/actions/games";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";

const AdminGamesScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresing, setIsRefresing] = useState(false);
  const [error, setError] = useState();
  const ownedGames = useSelector((state) => state.games.ownedGames);
  const dispatch = useDispatch();

  const openGameHandler = async (id) => { 
    await dispatch(gamesActions.setActiveGame(id));
    navigation.navigate('GameAdmin');
  };

  const loadGames = useCallback(async () => {
    setError(null);
    setIsRefresing(true);
    try {
      await dispatch(gamesActions.fetchOwnedGames());
    } catch (err) {
      setError(err.message);
    }
    setIsRefresing(false);
  }, [dispatch, setIsRefresing, setError]);

  useEffect(() => {
    const willFocusSub = navigation.addListener("willFocus", loadGames);
    return () => {
      willFocusSub.remove();
    };
  }, [loadGames]);

  useEffect(() => {
    setIsLoading(true);
    gamesActions.setActiveGame(null);
    loadGames().then(() => {
      setIsLoading(false);
    });;
  }, [dispatch, loadGames, setIsLoading]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Wystąpił błąd!</Text>
        <Text>{error}</Text>
        <Button
          title="Spróbuj ponownie"
          onPress={loadGames}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && ownedGames.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nie znaleziono żadnych gier!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.gamesList}
      onRefresh={loadGames}
      refreshing={isRefresing}
      data={ownedGames}
      renderItem={(itemData) => (
        <GameItem name={itemData.item.name} onSelect={() => {
          openGameHandler(itemData.item.id)
        }} />
      )}
    />
  );
};

AdminGamesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Moje gry",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-list"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Dodaj"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("CreateGame");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gamesList: {
    //marginVertical: 10,
  }
});

export default AdminGamesScreen;
