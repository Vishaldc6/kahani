import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AppNavigation from "./src/navigations/AppNavigation";
import { persistor, store } from "./src/redux/store/configureStore";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="auto" />
        <AppNavigation />
      </PersistGate>
    </Provider>
  );
}
