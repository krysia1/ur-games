import {
  DELETE_GAME,
  CREATE_GAME,
  UPDATE_GAME,
  SET_OWNED_GAMES,
  SET_PLAYER_GAMES,
  SET_ACTIVE_GAME,
  SET_PLAYERS
} from "../actions/games";
import Game from "../../models/game";

const initialState = {
  ownedGames: [],
  playerGames: [],
  players: [],
  activeGame: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_OWNED_GAMES:
      return {
        ...state,
        ownedGames: action.ownedGames,
      };
    case SET_PLAYER_GAMES:
      return {
        ...state,
        playerGames: action.playerGames,
      };
    case CREATE_GAME:
      const newGame = new Game(
        action.gameData.pid,
        action.gameData.ownerId,
        action.gameData.name,
        action.gameData.description,
        action.gameData.gameoverMessage,
        action.gameData.isOpen
      );
      return {
        ...state,
        ownedGames: state.ownedGames.concat(newGame),
      };
    case UPDATE_GAME:
      const gameIndex = state.ownedGames.findIndex(
        (game) => game.id === action.gid
      );
      const updatedGame = new Game(
        action.gid,
        state.ownedGames[gameIndex].ownerId,
        action.gameData.name,
        action.gameData.description,
        action.gameData.gameoverMessage,
        action.gameData.isOpen
      );
      const updatedOwnedGames = [...state.ownedGames];
      updatedOwnedGames[gameIndex] = updatedGame;
      const userGameIndex = state.userGames.findIndex(
        (game) => game.id === action.gid
      );
      const updatedUserGames = [...state.userGames];
      updatedUserGames[userGameIndex] = updatedGame;
      return {
        ...state,
        ownedGames: updatedOwnedGames,
        userGames: updatedUserGames,
      };
    case DELETE_GAME:
      return {
        ...state,
        ownedGames: state.ownedGames.filter(
          (game) => game.id !== action.gameId
        ),
        userGames: state.userGames.filter((game) => game.id !== action.gameId),
      };
    case SET_ACTIVE_GAME:
      const gameId = action.gameId;
      return {
        ...state,
        activeGame: gameId,
      };
      case SET_PLAYERS: 
      return {
        ...state,
        players: action.players
      }
  }
  return state;
};
