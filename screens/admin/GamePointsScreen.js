import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import GameItem from "../../components/games/gameItem";
import * as pointsActions from "../../store/actions/points";
import Colors from "../../constants/Colors";

const GamePointsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresing, setIsRefresing] = useState(false);
  const [error, setError] = useState();
  const activeGame = useSelector((state) => state.games.activeGame);
  const points = useSelector((state) => state.points.points);
  const dispatch = useDispatch();

  const openPointHandler = (id) => {
    navigation.navigate("PointEdit", { pointId: id });
  };

  const loadPoints = useCallback(async () => {
    setError(null);
    setIsRefresing(true);
    try {
      await dispatch(pointsActions.fetchPoints());
    } catch (err) {
      setError(err.message);
    }
    setIsRefresing(false);
  }, [dispatch, setIsRefresing, setError]);

  useEffect(() => {
    const willFocusSub = navigation.addListener("willFocus", loadPoints);
    return () => {
      willFocusSub.remove();
    };
  }, [loadPoints]);

  useEffect(() => {
    setIsLoading(true);
    loadPoints().then(() => {
      setIsLoading(false)
    });
  }, [dispatch, loadPoints, setIsLoading]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Wystąpił błąd!</Text>
        <Text>{error}</Text>
        <Button
          title="Spróbuj ponownie"
          onPress={loadPoints}
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

  if (!isLoading && points.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nie znaleziono żadnych punktów!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.pointsList}
      onRefresh={loadPoints}
      refreshing={isRefresing}
      data={points}
      renderItem={(itemData) => (
        <GameItem
          name={itemData.item.name}
          onSelect={() => {
            openPointHandler(itemData.item.id);
          }}
        />
      )}
    />
  );
};

GamePointsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Punkty",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Dodaj"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("PointEdit");
          }}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Dodaj"
          iconName={Platform.OS === "android" ? "md-close" : "ios-close"}
          onPress={() => {
            navData.navigation.navigate("MainApp");
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
  pointsList: {
    //marginVertical: 10,
  },
});

export default GamePointsScreen;
