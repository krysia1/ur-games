import Game from "../../models/game";
import Player from "../../models/player";

export const DELETE_GAME = "DELETE_GAME";
export const CREATE_GAME = "CREATE_GAME";
export const UPDATE_GAME = "UPDATE_GAME";
export const SET_OWNED_GAMES = "SET_OWNED_GAMES";
export const SET_PLAYER_GAMES = "SET_PLAYER_GAMES";
export const SET_ACTIVE_GAME = "SET_ACTIVE_GAME";
export const SET_PLAYERS = 'SET_PLAYERS'

export const fetchOwnedGames = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/gamesDetails.json?orderBy="/ownerId"&equalTo="${userId}"`
      );

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const resData = await response.json();

      const loadedGames = [];

      for (const key in resData) {
        loadedGames.push(
          new Game(
            key,
            resData[key].ownerId,
            resData[key].name,
            resData[key].description,
            resData[key].gameoverMessage,
            resData[key].isOpen
          )
        );
      }
      dispatch({
        type: SET_OWNED_GAMES,
        ownedGames: loadedGames,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchPlayerGames = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/playerGames/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const resData = await response.json();

      // console.log(resData);
      
      const loadedGames = [];

      for (const key in resData) {
        loadedGames.push(
          new Game(
            key,
            resData[key].ownerId,
            resData[key].name,
            resData[key].description,
            resData[key].gameoverMessage,
            resData[key].isOpen
          )
        );
      }
      dispatch({
        type: SET_PLAYER_GAMES,
        playerGames: loadedGames,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const joinGame = (gameId, teamName) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const playerGames = getState().games.playerGames;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/gamesDetails/${gameId}.json`
      );

      if (!response.ok) {
        throw new Error("Coś nie tak! Sprawdź czy wpisałeś właściwy identyfikator!");
      }

      const resData = await response.json();

      console.log(userId);

      const response2 = await fetch(
        `https://advenofy.firebaseio.com/playerGames/${userId}/${gameId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: resData.name,
            description: resData.description,
            gameoverMessage: resData.gameoverMessage,
            isOpen: resData.isOpen,
            ownerId: userId,
          }),
        }
      );

      if (!response2.ok) {
        throw new Error("Operacja się nie powiodła!");
      }

      const resData2 = await response2.json();

      console.log(resData2);

      const response3 = await fetch(
        `https://advenofy.firebaseio.com/participants/${gameId}/${userId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamName: teamName,
            acquiredPoints: false,
          }),
        }
      );
  
      const resData3 = await response3.json();

      console.log(resData3);

      const updatedPlayerGames = playerGames.concat(
        new Game(
          gameId,
          resData.ownerId,
          resData.name,
          resData.description,
          resData.gameoverMessage,
          resData.isOpen
        )
      )

      dispatch({
        type: SET_PLAYER_GAMES,
        playerGames: updatedPlayerGames,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteGame = (gameId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamesDetails/${gameId}.json`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Sth went wrong!");
    }

    dispatch({ type: DELETE_GAME, gameId: gameId });
  };
};

export const setActiveGame = (gameId) => {
    return async (dispatch) => {dispatch({ type: SET_ACTIVE_GAME, gameId: gameId })}
};

export const createGame = (name, description, gameoverMessage) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const isOpen = false
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamesDetails.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          gameoverMessage: gameoverMessage,
          isOpen: isOpen,
          ownerId: userId,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_GAME,
      gameData: {
        pid: resData.name,
        name,
        description,
        gameoverMessage,
        isOpen: isOpen,
        ownerId: userId,
      },
    });
  };
};

export const updateGame = (id, name, description, gameoverMessage, isOpen) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamesDetails/${id}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          gameoverMessage: gameoverMessage,
          isOpen: isOpen,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Sth went wrong!");
    }

    dispatch({
      type: UPDATE_GAME,
      gid: id,
      gameData: {
        name,
        description,
        gameoverMessage,
        isOpen
      },
    });
  };
};

export const fetchGamePlayers = (gameId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/participants/${gameId}.json`
      );

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const resData = await response.json();
      
      const players = [];

      for (const key in resData) {
        players.push(
          new Player(
            key,
            resData[key].teamName,
            resData[key].acquiredPoints,
          )
        );
      }

      dispatch({
        type: SET_PLAYERS,
        players: players,
      });
    } catch (err) {
      throw err;
    }
  };
};
