import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import useCustomWindowDimensions from "../hooks/useCustomWindowDimensions";
import { AppColors } from "../assets/colors/AppColors";
import { Ionicons } from "@expo/vector-icons";

interface BaseInputProps {
  errorText?: string;
  isPasswordField?: boolean;
  onSecureTextEntryPress?: () => void;
}

const BaseInput = (props: BaseInputProps & TextInputProps) => {
  const styles = useStyles();
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          {...props}
          style={[styles.textInput, props.style]}
          placeholderTextColor={AppColors.PRIMARY}
        />
        {props.isPasswordField && (
          <Ionicons
            name={props.secureTextEntry ? "eye-outline" : "eye-off-outline"}
            size={22}
            onPress={props.onSecureTextEntryPress}
            style={styles.eyeIcon}
            color={AppColors.PRIMARY}
          />
        )}
      </View>
      {props.errorText && (
        <Text style={styles.errorText}>{props.errorText}</Text>
      )}
    </View>
  );
};

export default memo(BaseInput);

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: AppColors.PRIMARY,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.1),
      borderRadius: wp(2),
      marginHorizontal: wp(4),
      marginVertical: hp(1.2),
      flexDirection: "row",
      alignItems: "center",
    },
    eyeIcon: {
      marginLeft: wp(1),
    },
    textInput: {
      flex: 1,
      height: hp(5),
      fontWeight: "400",
      fontSize: 16,
    },
    errorText: {
      color: AppColors.ERROR,
      marginHorizontal: wp(5),
    },
  });
};
