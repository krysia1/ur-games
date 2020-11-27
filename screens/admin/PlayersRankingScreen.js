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

import PlayerItem from "../../components/games/playerItem";
import * as gamesActions from "../../store/actions/games";
import Colors from "../../constants/Colors";

const PlayersRankingScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresing, setIsRefresing] = useState(false);
  const [error, setError] = useState();
  const activeGame = useSelector((state) => state.games.activeGame);
  const points = useSelector((state) => state.points.points);
  const pointsLength = points.length;
  const players = useSelector((state) => state.games.players);
  const dispatch = useDispatch();

  const loadPlayers = useCallback(async () => {
    setError(null);
    setIsRefresing(true);
    try {
      await dispatch(gamesActions.fetchGamePlayers(activeGame));
    } catch (err) {
      setError(err.message);
    }
    setIsRefresing(false);
  }, [dispatch, setIsRefresing, setError]);

  useEffect(() => {
    const willFocusSub = navigation.addListener("willFocus", loadPlayers);
    return () => {
      willFocusSub.remove();
    };
  }, [loadPlayers]);

  useEffect(() => {
    setIsLoading(true);
    loadPlayers().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadPlayers, setIsLoading]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Wystąpił błąd!</Text>
        <Text>{error}</Text>
        <Button
          title="Spróbuj ponownie"
          onPress={loadPlayers}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (!isLoading && players.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nikt jeszcze nie dołączył do rozgrywki!</Text>
        <Text>Udostepnij uczestnikom identyfikator rozgrywki, aby mogli dołączyć!</Text>
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

  return (
    <FlatList
      style={styles.pointsList}
      onRefresh={loadPlayers}
      refreshing={isRefresing}
      data={players.sort((a, b) => parseFloat(b.acquiredPoints.length) - parseFloat(a.acquiredPoints.length))}
      renderItem={(itemData) => (
        <PlayerItem
          name={itemData.item.teamName}
          acquiredPoints={itemData.item.acquiredPoints ? itemData.item.acquiredPoints.length : 0}
          totalPoints={pointsLength}
          onSelect={() => {}}
        />
      )}
    />
  );
};

PlayersRankingScreen.navigationOptions = (navData) => {
    return {
      headerTitle: "Ranking",
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

export default PlayersRankingScreen;
