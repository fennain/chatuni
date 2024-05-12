import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { configureStore, combineReducers, Middleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import storage from "redux-persist/lib/storage";
import global from "./modules/global";
import user from "./modules/user";
import auth from "./modules/auth";

// create reducer
const reducer = combineReducers({ global, user, auth });

// redux persist
const persistConfig = {
  key: "redux-state",
  storage: storage,
  blacklist: ["auth"],
};
const persistReducerConfig = persistReducer(persistConfig, reducer);

// redux middleWares(self configuration)
const middleWares: Middleware[] = [thunk];

// store
export const store = configureStore({
  reducer: persistReducerConfig,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middleWares),
  devTools: true,
});

// create persist store
export const persistor = persistStore(store);

// redux hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();
