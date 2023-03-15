const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "kind":
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
