import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import useCustomWindowDimensions from "../hooks/useCustomWindowDimensions";
import { AppColors } from "../assets/colors/AppColors";
import { Ionicons } from "@expo/vector-icons";

interface BaseButtonProps {
  title: string;
  prefixIcon?: string;
}

const BaseButton = (props: TouchableOpacityProps & BaseButtonProps) => {
  const styles = useStyles();
  return (
    <TouchableOpacity {...props} style={[styles.container, props.style]}>
      {props.prefixIcon && (
        <Ionicons
          // name="heart-outline"
          // name="heart"
          name={props.prefixIcon}
          size={20}
        />
      )}
      <Text style={styles.btnTxt}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default memo(BaseButton);

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: AppColors.PRIMARY,
      backgroundColor: AppColors.SECONDARY,
      justifyContent: "center",
      alignItems: "center",
      padding: wp(3),
      borderRadius: wp(2),
      marginHorizontal: wp(4),
      marginVertical: hp(1.2),
      flexDirection: "row",
      gap: wp(2),
    },
    btnTxt: {
      color: AppColors.PRIMARY_TEXT,
      fontWeight: "500",
      fontSize: 16,
    },
  });
};
