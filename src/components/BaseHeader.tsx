import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, ReactNode } from "react";
import useCustomWindowDimensions from "../hooks/useCustomWindowDimensions";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../assets/colors/AppColors";

interface BaseHeaderPropsType {
  title?: string;
  rightIcon?: string;
  leftIcon?: string;
  leftIconPress?: () => void;
  rightIconPress?: () => void;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
}

const BaseHeader = (props: BaseHeaderPropsType) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {props.leftIcon && (
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={props.leftIconPress}
        >
          <Ionicons name={props.leftIcon} size={20} color={AppColors.PRIMARY} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{props.title}</Text>
      {props.rightIcon && (
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={props.rightIconPress}
        >
          <Ionicons
            name={props.rightIcon}
            size={20}
            color={AppColors.PRIMARY}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(BaseHeader);

const useStyles = () => {
  const { wp, hp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      paddingTop: StatusBar.currentHeight + wp(4),
      padding: wp(4),
      alignItems: "center",
      flexDirection: "row",
      elevation: 1,
      backgroundColor: AppColors.SECONDARY_BACKGROUND,
    },
    title: {
      flex: 1,
      fontSize: 20,
      marginHorizontal: wp(4),
      color: AppColors.PRIMARY_TEXT,
      fontWeight: "500",
      // textAlign: "center",
    },
    btnContainer: {
      borderWidth: 2,
      borderColor: AppColors.PRIMARY,
      justifyContent: "center",
      alignItems: "center",
      padding: wp(2),
      borderRadius: wp(2),
    },
  });
};
