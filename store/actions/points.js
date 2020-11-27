import Point from "../../models/point";

export const DELETE_POINT = "DELETE_POINT";
export const CREATE_POINT = "CREATE_POINT";
export const UPDATE_POINT = "UPDATE_POINT";
export const SET_POINTS = "SET_POINTS";
export const SET_PLAYER_POINTS = "SET_PLAYER_POINTS";
export const ACQUIRE_POINT = "ACQUIRE_POINT";

export const fetchPoints = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const activeGame = getState().games.activeGame;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/gamePoints/${activeGame}.json`
      );

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const resData = await response.json();

      const loadedPoints = [];

      for (const key in resData) {
        if (resData[key] !== null) {
          loadedPoints.push(
            new Point(
              key,
              resData[key].name,
              resData[key].description,
              resData[key].code,
              resData[key].location ? resData[key].location.lat : null,
              resData[key].location ? resData[key].location.lng : null
            )
          );
        }
      }

      dispatch({
        type: SET_POINTS,
        points: loadedPoints,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchPlayerPoints = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const activeGame = getState().games.activeGame;
    try {
      const response = await fetch(
        `https://advenofy.firebaseio.com/gamePoints/${activeGame}.json`
      );

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const resData = await response.json();

      const loadedPoints = [];

      for (const key in resData) {
        if (resData[key] !== null) {
          loadedPoints.push(
            new Point(
              key,
              resData[key].name,
              resData[key].description,
              resData[key].code,
              resData[key].location ? resData[key].location.lat : null,
              resData[key].location ? resData[key].location.lng : null
            )
          );
        }
      }

      const response2 = await fetch(
        `https://advenofy.firebaseio.com/participants/${activeGame}/${userId}/acquiredPoints.json`
      );

      if (!response2.ok) {
        throw new Error("Something is wrong!");
      }

      const resData2 = await response2.json();

      const loadedAcquiredPoints = [];

      if (resData2 !== null) {
        for (const key in resData2) {
          if (resData2[key] !== null) {
            loadedAcquiredPoints.push(resData2[key]);
          }
        }
      }

      dispatch({
        type: SET_PLAYER_POINTS,
        points: loadedPoints,
        acquiredPoints: loadedAcquiredPoints,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const acquirePoint = (id, code) => {
  return async (dispatch, getState) => {
    const gameId = getState().games.activeGame;
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const acquiredPoints = getState().points.acquiredPoints;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamePoints/${gameId}/${id}/code.json`
    );

    if (!response.ok) {
      throw new Error("Sth went wrong!");
    }

    const resData = await response.json();

    if (resData.toString() === code.toString()) {
      const newAcquiredPoints = acquiredPoints.concat(id);

      const response2 = await fetch(
        `https://advenofy.firebaseio.com/participants/${gameId}/${userId}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acquiredPoints: newAcquiredPoints,
          }),
        }
      );

      const resData2 = await response2.json();

      dispatch({
        type: ACQUIRE_POINT,
        pid: id,
      });
    } else {
      throw new Error("Podane hasło jest błędne!");
    }
  };
};

export const delatePoint = (pointId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const gameId = getState().games.activeGame;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamePoints/${activeGame}/${pointId}.json`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Sth went wrong!");
    }

    dispatch({ type: DELETE_POINT, pointId: pointId });
  };
};

export const createPoint = (name, description, code, location) => {
  return async (dispatch, getState) => {
    const gameId = getState().games.activeGame;
    const token = getState().auth.token;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamePoints/${gameId}.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          code: code,
          location: {
            lat: location.lat,
            lng: location.lng
          },
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_POINT,
      pointData: {
        pid: resData.name,
        name,
        description,
        code,
        lat: location.lat,
        lng: location.lng
      },
    });
  };
};

export const updatePoint = (id, name, description, code, location) => {
  return async (dispatch, getState) => {
    const gameId = getState().games.activeGame;
    const token = getState().auth.token;
    const response = await fetch(
      `https://advenofy.firebaseio.com/gamePoints/${gameId}/${id}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          code: code,
          location: {
            lat: location.lat,
            lng: location.lng
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Sth went wrong!");
    }

    dispatch({
      type: UPDATE_POINT,
      pid: id,
      pointData: {
        name,
        description,
        code,
        lat: location.lat,
        lng: location.lng
      },
    });
  };
};
