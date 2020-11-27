import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Card from "../../components/UI/Card2";
import Input from "../../components/UI/Input";
import MapPreview from "../../components/UI/MapPreview";
import Colors from "../../constants/Colors";
import * as pointsActions from "../../store/actions/points";

const PointDetailsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputIsValid, setInputIsValid] = useState(false);
  const [isAcquired, setIsAcquired] = useState(false);
  const dispatch = useDispatch();
  const pointId = navigation.getParam("pointId");
  const point = useSelector((state) =>
    state.points.points.find((point) => point.id === pointId)
  );
  const acquiredPoints = useSelector((state) => state.points.acquiredPoints);
  const selectedLocation = { lat: point.lat, lng: point.lng };

  useEffect(() => {
    const acquiredId = acquiredPoints.find((Id) => Id === pointId);
    if (acquiredId) {
      setIsAcquired(true);
    }
  }, [pointId, acquiredPoints]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error! ", error, [{ text: "ok" }]);
    }
  }, [error]);

  useEffect(() => {
    navigation.setParams({ gameName: point.name });
  }, [point]);

  const showMapHandler = () => {
    navigation.navigate("Map", {
      readonly: true,
      initialLocation: selectedLocation,
    });
  };

  const submitHandler = useCallback(async () => {
    if (!inputIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    setError(false);
    setIsLoading(true);

    try {
      await dispatch(pointsActions.acquirePoint(pointId, inputValue));
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, inputValue, inputIsValid, pointId]);

  const inputChangeHandler = useCallback(
    (id, inputValue, inputValidity) => {
      setInputValue(inputValue);
      setInputIsValid(inputValidity);
    },
    [dispatch, setInputValue, setInputIsValid]
  );

  let bottomCard = (
    <View style={styles.bottomContainer}>
      <Text style={styles.idTitle}>Podaj hasło:</Text>
      <Input
        id="code"
        label="Hasło"
        errorText="Proszę wprowadzić prawidłowe hasło"
        onInputChange={inputChangeHandler}
        initialValue={""}
        initialValid={false}
        required
      />
      <View style={styles.button}>
        <Button
          title="Zatwierdź"
          color={Colors.primary}
          onPress={submitHandler}
        />
      </View>
    </View>
  );

  if (isAcquired) {
    bottomCard = (
      <View style={styles.bottomContainer}>
        <Text style={styles.idTitle}>Punkt zaliczony!</Text>
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
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.locationContainer}>
        <MapPreview
          style={styles.mapPreview}
          location={selectedLocation}
          onPress={showMapHandler}
        />
      </View>
      <View style={styles.screen}>
        <ScrollView style={styles.textContainer}>
          {/* <Text style={styles.label}>Nazwa punktu</Text> */}
          <Text style={styles.title}>{point.name}</Text>
          {/* <Text style={styles.label}>Opis</Text> */}
          <Text style={styles.description}>{point.description}</Text>
        </ScrollView>

        <View>
          <Card>{bottomCard}</Card>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

PointDetailsScreen.navigationOptions = (navData) => {
  const pointName = navData.navigation.getParam("gameName");
  return {
    headerTitle: pointName,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  textContainer: {
    flex: 1,
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
  description: {
    marginBottom: 15,
  },
  idTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomContainer: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingTop: 5,
  },
  mapPreview: {
    width: "100%",
    //maxWidth: 350,
    height: 200,
    //borderBottomLeftRadius: 10,
    //borderBottomRightRadius: 10,
  },
  locationContainer: {
    //marginVertical: 5,
    width: "100%",
    //maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "black",
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 5,
    backgroundColor: "white",
    //borderRadius: 10,
  },
});

export default PointDetailsScreen;
