import {
  DELETE_POINT,
  CREATE_POINT,
  UPDATE_POINT,
  SET_POINTS,
  ACQUIRE_POINT,
  SET_PLAYER_POINTS,
} from "../actions/points";
import Point from "../../models/point";

const initialState = {
  points: [],
  acquiredPoints: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POINTS:
      return {
        ...state,
        points: action.points,
      };
    case SET_PLAYER_POINTS:
      return {
        ...state,
        points: action.points,
        acquiredPoints: action.acquiredPoints,
      };
    case ACQUIRE_POINT:
      return {
        ...state,
        acquiredPoints: state.acquiredPoints.concat(action.pid)
      };
    case CREATE_POINT:
      const newPoint = new Point(
        action.pointData.pid,
        action.pointData.name,
        action.pointData.description,
        action.pointData.code,
        action.pointData.lat,
        action.pointData.lng
      );
      return {
        ...state,
        points: state.points.concat(newPoint),
      };
    case UPDATE_POINT:
      const pointIndex = state.points.findIndex(
        (point) => point.id === action.pid
      );
      const updatedPoint = new Point(
        action.pid,
        action.pointData.name,
        action.pointData.description,
        action.pointData.code,
        action.pointData.lat,
        action.pointData.lng
      );
      const updatedPoints = [...state.points];
      updatedPoints[pointIndex] = updatedPoint;
      return {
        ...state,
        points: updatedPoints,
      };
    case DELETE_POINT:
      return {
        ...state,
        points: state.points.filter((point) => point.id !== action.pointId),
      };
  }
  return state;
};
