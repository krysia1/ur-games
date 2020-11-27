import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import LocationPicker from "../../components/UI/LocationPicker";
import * as pointsActions from "../../store/actions/points";
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

const PointDetailsEditScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const pointId = navigation.getParam("pointId");
  const editedPoint = useSelector((state) =>
    state.points.points.find((point) => point.id === pointId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedPoint ? editedPoint.name : "",
      description: editedPoint ? editedPoint.description : "",
      code: editedPoint ? editedPoint.code.toString() : "",
    },
    inputValidities: {
      name: editedPoint ? true : false,
      description: editedPoint ? true : false,
      code: editedPoint ? true : false,
    },
    formisValid: editedPoint ? true : false,
  });

  useEffect(() => {
    if (editedPoint) {
      const location = {
        lat: editedPoint.lat,
        lng: editedPoint.lng,
      };
      setSelectedLocation(location);
    }
  }, [editedPoint]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error! ", error, [{ text: "ok" }]);
    }
  }, [error]);

  const locationPickedHandler = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const submitHandler = useCallback(async () => {
    if (!formState.formisValid || !selectedLocation) {
      Alert.alert("Błąd!", "Sprawdź wprowadzone dane.", [{ text: "Ok" }]);
      return;
    }

    setError(false);
    setIsLoading(true);

    try {
      if (editedPoint) {
        await dispatch(
          pointsActions.updatePoint(
            pointId,
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.code,
            selectedLocation
          )
        );
        navigation.goBack();
      } else {
        await dispatch(
          pointsActions.createPoint(
            formState.inputValues.name,
            formState.inputValues.description,
            formState.inputValues.code,
            selectedLocation
          )
        );
        navigation.goBack();
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, pointId, formState, selectedLocation]);

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
            initialValue={editedPoint ? editedPoint.name.toString() : ""}
            initialValid={!!editedPoint}
            required
            minLength={5}
          />
          <Input
            id="description"
            label="Opis"
            errorText="Proszę podać właściwy opis"
            multiLine
            onInputChange={inputChangeHandler}
            initialValue={editedPoint ? editedPoint.description : ""}
            initialValid={!!editedPoint}
          />
          <Input
            id="code"
            label="Ustaw hasło zatwierdzające"
            errorText="Proszę podać właściwe hasło"
            onInputChange={inputChangeHandler}
            initialValue={editedPoint ? editedPoint.code.toString() : ""}
            initialValid={!!editedPoint}
            required
          />
          <View>
          <Text style={styles.label}>Lokalizacja</Text>
            <LocationPicker
              navigation={navigation}
              onLocationPicked={locationPickedHandler}
              initialLocation={editedPoint ? selectedLocation : null}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

PointDetailsEditScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("pointId")
      ? "Edytuj punkt"
      : "Dodaj punkt",
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
  label: {
    //fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
});
export default PointDetailsEditScreen;
