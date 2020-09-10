export const initialState = {
  user: null,
  avatarUrl: ""
};

const reducer = (state, action) => {
  console.log(action);

  // action -> type, [payload]

  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_AVATAR":
      return {
        ...state,
        avatarUrl: action.avatarUrl
      };

    default:
      return state;
  }
};

export default reducer;
