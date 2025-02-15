import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import {
  BaseButton,
  BaseHeader,
  BaseInput,
  BaseLoader,
} from "../../components";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/store/configureStore";
import { updateDocument } from "../../utils/databaseHelper";
import { setUser } from "../../redux/slices/UserSlice";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { DrawerActions } from "@react-navigation/native";

const ProfileValidationSchema = Yup.object({
  name: Yup.string()
    .required("* Please enter your name")
    .min(3, "* Name should be at least 3 characters"),
});

const ProfileScreen = () => {
  const styles = useStyles();
  const navigation = useCustomNavigation("Profile");

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.UserReducer);

  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues: {
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        confirm_password: "",
      },
      validationSchema: ProfileValidationSchema,
      onSubmit: (values) => {
        if (user.name != values.name) {
          setIsLoading(true);

          const userData = {
            name: values.name,
          };

          updateDocument("Users", user.id, userData)
            .then(() => {
              dispatch(setUser({ ...user, ...userData }));
              Alert.alert("Profile", "Profile updated successfully !!");
              setIsLoading(false);
            })
            .catch((error) => {
              console.log({ error });
              Alert.alert("Error", "Profile update failed !!");
              setIsLoading(false);
            });
        }
      },
    });

  return (
    <>
      <BaseHeader
        title="Profile"
        leftIcon="menu"
        leftIconPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      />
      {isLoading && <BaseLoader />}
      <View style={styles.container}>
        {/* PROFILE IMAGE */}
        <BaseInput
          placeholder="Name"
          onChangeText={handleChange("name")}
          value={values.name}
          errorText={touched.name && errors.name}
          onBlur={handleBlur("name")}
        />
        <BaseInput
          placeholder="Email"
          value={values.email}
          editable={false}
          errorText={touched.email && errors.email}
        />
        <BaseButton title="Save Profile" onPress={() => handleSubmit()} />

        {/* CHANGE PASSWORD */}
      </View>
    </>
  );
};

export default ProfileScreen;

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.5),
    },
  });
};
