import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
let user = null;
if (token) {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      user = JSON.parse(userString);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    user = null;
  }
}

const initialState = {
  isAuth: !!token,
  token: token || null,
  user: user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.token = action.payload.token;
      state.user = action.payload.admin;
      localStorage.setItem("token", action.payload.token);
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.admin));
      } catch (error) {
        console.error("Error storing user in localStorage:", error);
      }
    },
    logout: (state) => {
      state.isAuth = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    refreshUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error storing user in localStorage:", error);
        }
      }
    },
  },
});

export const { login, logout, refreshUser } = authSlice.actions;
export default authSlice.reducer;
