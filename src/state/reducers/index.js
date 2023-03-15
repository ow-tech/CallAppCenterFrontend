import { combineReducers } from "redux";
import kindReducer from "./kindReducer";
import idReducer from "./idReducer";

const reducers = combineReducers({
  kind: kindReducer,
  id: idReducer
});

export default reducers;
