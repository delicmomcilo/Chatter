export const initialState = {
  user: null,
  avatarImg: "",
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
        avatarImg: action.avatarImg,
      };

    default:
      return state;
  }
};

export default reducer;
