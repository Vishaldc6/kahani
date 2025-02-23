import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

import AppNavigation from "./src/navigations/AppNavigation";
import { persistor, store } from "./src/redux/store/configureStore";
import { AppColors } from "./src/assets/colors/AppColors";
import useCustomWindowDimensions from "./src/hooks/useCustomWindowDimensions";

export default function App() {
  const styles = useStyle();

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      state.isConnected && state.isInternetReachable && setIsConnected(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="auto" />
        <AppNavigation />
        <Modal
          transparent
          statusBarTranslucent
          visible={!isConnected}
          animationType="fade"
        >
          <View style={styles.menuModalContainer}>
            <View style={styles.menuContent}>
              <Text style={styles.header}>{"Network Problem"}</Text>
              <Text style={styles.subHeader}>
                {"Please check your internet connection."}
              </Text>
              <Ionicons
                name="refresh"
                size={30}
                color={AppColors.PRIMARY}
                onPress={() => NetInfo.refresh()}
              />
            </View>
          </View>
        </Modal>
      </PersistGate>
    </Provider>
  );
}

const useStyle = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    menuModalContainer: {
      backgroundColor: AppColors.TRANSPARENT,
      flex: 1,
      justifyContent: "center",
    },
    menuContent: {
      backgroundColor: AppColors.WHITE,
      padding: wp(5),
      margin: wp(5),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
      gap: hp(1.5),
    },
    header: {
      fontSize: 20,
      fontWeight: "500",
    },
    subHeader: {
      fontSize: 18,
      textAlign: "center",
    },
  });
};
