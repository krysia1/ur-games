import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const StartupScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expDate } = transformedData;
      const expirationDate = new Date(expDate);

      const exDate = new Date(expDate);
      if (exDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      const expTime = expirationDate.getTime() - new Date().getTime();

      props.navigation.navigate("MainApp");
      dispatch(authActions.auth(userId, token, expTime));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.view}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartupScreen;
