export const signOut = (dispatch) => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");

    dispatch({
        type: "SET_GENERAL_STATE",
        payload: {
          user : {}
        },
    })
}