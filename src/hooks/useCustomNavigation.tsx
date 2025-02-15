import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerParamList, RootStackParamList } from "../types/RootNavigation";

const useCustomNavigation = (
  screenName: keyof RootStackParamList | keyof DrawerParamList
) => {
  type Props = NativeStackNavigationProp<
    RootStackParamList & DrawerParamList,
    typeof screenName
  >;
  const navigation = useNavigation<Props>();
  return navigation;
};

export default useCustomNavigation;
