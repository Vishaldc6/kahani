import { useWindowDimensions } from "react-native";

const useCustomWindowDimensions = () => {
  const { height, width } = useWindowDimensions();
  const hp = (i: number) => (height * i) / 100;
  const wp = (i: number) => (width * i) / 100;
  return {
    hp,
    wp,
  };
};

export default useCustomWindowDimensions;
