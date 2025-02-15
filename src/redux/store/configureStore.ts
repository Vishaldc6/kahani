import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import UserSlice from "../slices/UserSlice";
import StorySlice from "../slices/StorySlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const reducers = combineReducers({
  UserReducer: UserSlice,
  StoryReducer: StorySlice,
});

export const USER_LOGOUT = "USER_LOGOUT";

const rootReducer = (
  state: ReturnType<typeof reducers> | undefined,
  action: any
) => {
  if (action.type === USER_LOGOUT) {
    AsyncStorage.removeItem("persist:root");
    return reducers(undefined, action); // Reset all reducers to their initial state
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    __DEV__
      ? getDefaultMiddleware({
          serializableCheck: false,
        })
      : getDefaultMiddleware(),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
