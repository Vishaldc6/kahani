import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";

import {
  AddStoryScreen,
  LoginScreen,
  ReadStoryScreen,
  RegisterScreen,
} from "../../screens";
import DrawerNavigation from "../DrawerNavigation";
import { RootStackParamList } from "../../types/RootNavigation";
import { useAppSelector } from "../../redux/store/configureStore";
import { AppColors } from "../../assets/colors/AppColors";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const _theme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: AppColors.PRIMARY_BACKGROUND,
      text: AppColors.PRIMARY_TEXT,
      primary: AppColors.PRIMARY,
    },
  };

  const { user } = useAppSelector((state) => state.UserReducer);

  return (
    <NavigationContainer theme={_theme}>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          // statusBarTranslucent: true,
        }}
        initialRouteName={user?.id ? "Drawer" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Drawer" component={DrawerNavigation} />
        <Stack.Screen name="AddStory" component={AddStoryScreen} />
        <Stack.Screen name="ReadStory" component={ReadStoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
