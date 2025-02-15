import React, { memo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppColors } from "../assets/colors/AppColors";

const BaseLoader = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={AppColors.PRIMARY} />
    </View>
  );
};

export default memo(BaseLoader);

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: AppColors.TRANSPARENT,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 99999999,
    },
  });
};
