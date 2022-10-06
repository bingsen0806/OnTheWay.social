/* eslint-disable */
import { combineReducers, PayloadAction } from "@reduxjs/toolkit";
import home from "./slices/homeSlice";
import posts from "./slices/postsSlice";
import faq from "./slices/faqSlice";
import user from "./slices/userSlice";
import { RootState } from "./store";

const appReducer = combineReducers({
  home,
  posts,
  faq,
  user,
});

export const rootReducer: typeof appReducer = (state, action) => {
  // if a USER_LOGOUT action is dispatched, refresh the entire redux library
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
