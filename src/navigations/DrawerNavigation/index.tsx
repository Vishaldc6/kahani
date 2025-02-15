import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import DrawerContainer from "./DrawerContainer";
import {
  HomeScreen,
  AddStoryScreen,
  ProfileScreen,
  DraftStoryScreen,
} from "../../screens";
import { DrawerParamList } from "../../types/RootNavigation";
import { AppColors } from "../../assets/colors/AppColors";

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigation = () => {
  const navigation = useCustomNavigation("Drawer");
  const { wp } = useCustomWindowDimensions();

  return (
    <Drawer.Navigator
      id={navigation.getParent()}
      drawerContent={(props) => <DrawerContainer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "back",
        drawerActiveBackgroundColor: AppColors.SECONDARY,
        drawerActiveTintColor: AppColors.PRIMARY_TEXT,
        drawerItemStyle: {
          borderRadius: wp(3),
        },
        drawerLabelStyle: {
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="DraftStory"
        component={DraftStoryScreen}
        options={{
          drawerLabel: "Draft Story",
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "Profile",
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
