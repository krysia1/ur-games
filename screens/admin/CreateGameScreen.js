import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as gamesActions from "../../store/actions/games";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_UPDATE = "UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      ...state,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
      formisValid: formIsValid,
    };
  }
  return state;
};

const CreateGameScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const gameId = navigation.getParam("gameId");
  const editedGame = useSelector((state) =>
    state.games.ownedGames.find((game) => game.id === gameId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedGame ? editedGame.name : "",
      description: editedGame ? editedGame.description : "",
      gameoverMessage: editedGame ? editedGame.gameoverMessage : "",
      isOpen: editedGame ? editedGame.isOpen : 'false',
    },
    inputValidities: {
      name: editedGame ? true : false,
      description: editedGame ? true : false,
      gameoverMessage: editedGame ? true : false,
      isOpen: editedGame ? true : true,
    },
    formisValid: editedGame ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Error! ", error, [{ text: "ok" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formisValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay" },
      ]);
      return;
    }

    setError(false);
    setIsLoading(true);

    try {
      if (editedGame) {
        await dispatch(
          gamesActions.updateGame(
            gameId,
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.gameoverMessage,
            formState.inputValues.isOpen
          )
        );
        navigation.goBack();
      } else {
        await dispatch(
            gamesActions.createGame(
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.gameoverMessage
          )
        );
        navigation.goBack();
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, gameId, formState]);

  useEffect(() => {
    navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="name"
            label="Nazwa"
            errorText="Proszę wprowadzić właściwą nazwę"
            onInputChange={inputChangeHandler}
            initialValue={editedGame ? editedGame.name : ""}
            initialValid={!!editedGame}
            required
            minLength={5}
          />
          <Input
            id="description"
            label="Opis"
            errorText="Proszę podać właściwy opis"
            multiLine
            onInputChange={inputChangeHandler}
            initialValue={editedGame ? editedGame.description : ""}
            initialValid={!!editedGame}
          />
          <Input
            id="gameoverMessage"
            label="Wiadomość końca gry"
            errorText="Proszę podać właściwą wiadomość"
            multiLine
            onInputChange={inputChangeHandler}
            initialValue={editedGame ? editedGame.gameoverMessage : ""}
            initialValid={!!editedGame}
          />
          {editedGame ? (
            <Input
              id="isOpen"
              label="Otwarta?"
              errorText="Coś poszło nie tak :/"
              onInputChange={inputChangeHandler}
              initialValue={editedGame ? editedGame.isOpen : ""}
              initialValid={!!editedGame}
              required
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

CreateGameScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("gameId")
      ? "Edytuj grę"
      : "Dodaj grę",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Zapisz"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateGameScreen;
