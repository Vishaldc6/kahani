import React from "react";
import { Alert, StyleSheet } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { getAuth } from "firebase/auth";

import { useAppDispatch, USER_LOGOUT } from "../../redux/store/configureStore";
import { app } from "../../utils/firebaseConfig";
import { AppColors } from "../../assets/colors/AppColors";

const DrawerContainer = (props: DrawerContentComponentProps) => {
  const { descriptors, navigation, state } = props;
  const dispatch = useAppDispatch();

  const confirmLogOut = () => {
    Alert.alert(
      "Confirm Logout",
      "You will be signed out and may need to log in again.",
      [
        {
          text: "Cancel",
        },
        {
          text: "Log Out",
          onPress: handleLogOut,
        },
      ]
    );
  };

  const handleLogOut = () => {
    const auth = getAuth(app);
    auth
      .signOut()
      .then(() => {
        console.log("signed out !!");
        dispatch({ type: USER_LOGOUT });
        navigation.reset({
          routes: [
            {
              name: "Login",
            },
          ],
          index: 0,
        });
      })
      .catch((error) => {
        console.log({ error });
        Alert.alert("Error", "Something went wrong !");
      });
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: AppColors.SECONDARY_BACKGROUND,
      }}
    >
      <DrawerItemList {...props} />
      <DrawerItem
        label={"Log out"}
        onPress={confirmLogOut}
        labelStyle={{ color: AppColors.ERROR, fontSize: 18 }}
      />
    </DrawerContentScrollView>
  );
};

export default DrawerContainer;

const styles = StyleSheet.create({});
