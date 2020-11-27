import React from "react";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { useDispatch } from "react-redux";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";

import GameScreen from "../screens/player/GameScreen";
import PointDetailsScreen from "../screens/player/PointDetailsScreen";
import GamesOverviewScreen from "../screens/player/GamesOverviewScreen";
import JoinGameScreen from "../screens/player/JoinGameScreen";
import AdminGamesScreen from "../screens/admin/AdminGamesScreen";
import AdminPointDetailsScreen from "../screens/admin/AdminPointDetailsScreen";
import CreateGameScreen from "../screens/admin/CreateGameScreen";
import GameDetailsScreen from "../screens/admin/GameDetailsScreen";
import GamePointsScreen from "../screens/admin/GamePointsScreen";
import PlayersRankingScreen from "../screens/admin/PlayersRankingScreen";
import PointDetailsEditScreen from "../screens/admin/PointDetailsEditScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import StartupScreen from "../screens/StartupScreen";
import MapScreen from '../screens/MapScreen'
import * as authActions from "../store/actions/auth";

import Colors from "../constants/Colors";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    //fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    //fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const PlayerGamesNavigator = createStackNavigator(
  {
    GamesOverview: {
      screen: GamesOverviewScreen,
    },
    JoinGame: {
      screen: JoinGameScreen,
    },
    Game: {
      screen: GameScreen,
    },
    PointDetails: {
      screen: PointDetailsScreen,
    },
    Map: {
      screen: MapScreen,
    },
    GameOver: {
      screen: GameScreen,
    },
  },
  {
    navigationOptions: {
      drawerLabel: "Panel gracza",
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-person" : "ios-person"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const GamePointsNavigator = createStackNavigator(
  {
    GamePoints: {
      screen: GamePointsScreen,
    },
    PointEdit: {
      screen: PointDetailsEditScreen,
    },
    Map: {
      screen: MapScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const RankingNavigator = createStackNavigator(
  {
    Ranking: {
      screen: PlayersRankingScreen,
    },
    PlayerOverview: {
      screen: PlayersRankingScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const GameDetailsNavigator = createStackNavigator(
  {
    GameDetails: {
      screen: GameDetailsScreen,
    },
    GameEdit: {
      screen: CreateGameScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const GameAdminTabConfig = {
  Points: {
    screen: GamePointsNavigator,
    navigationOptions: {
      title: 'Punkty',
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="ios-compass" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primary,
    },
  },
  Ranking: {
    screen: RankingNavigator,
    navigationOptions: {
      title: 'Ranking',
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="ios-filing" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.accent,
    },
  },
  GameDetails: {
    screen: GameDetailsNavigator,
    navigationOptions: {
      title: 'Ustawienia gry',
      tabBarIcon: (tabInfo) => {
        return (
          <Ionicons name="ios-settings" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.accent,
    },
  },
};

const GameAdminTabNavigator = createBottomTabNavigator(GameAdminTabConfig, {
  tabBarOptions: {
    activeTintColor: Colors.accent,
  },
});

const AdminGamesNavigator = createStackNavigator(
  {
    GamesOverview: {
      screen: AdminGamesScreen,
    },
    CreateGame: {
      screen: CreateGameScreen,
    },
  },
  {
    navigationOptions: {
      drawerLabel: "Panel Organizatora",
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-construct" : "ios-construct"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainDrawerNavigator = createDrawerNavigator(
  {
    Player: PlayerGamesNavigator,
    Admin: AdminGamesNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();

      return (
        <View style={{ flex: 1, marginTop: 32 }}>
          <SafeAreaView forceInsert={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  MainApp: MainDrawerNavigator,
  GameAdmin: {
    screen: GameAdminTabNavigator,
  },
  Auth: AuthNavigator,
});

export default createAppContainer(MainNavigator);
