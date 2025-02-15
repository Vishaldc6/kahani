import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { StoryType } from "../redux/slices/StorySlice";

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: NavigatorScreenParams<DrawerParamList>;
  AddStory: undefined | Partial<StoryType>;
  ReadStory: { _id: string };
};

export type DrawerParamList = {
  Home: undefined;
  DraftStory: undefined;
  Profile: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
