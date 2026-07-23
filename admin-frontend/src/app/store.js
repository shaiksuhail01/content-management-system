import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";

import standardsReducer from "../features/standards/standardsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    standards: standardsReducer,
  },
});