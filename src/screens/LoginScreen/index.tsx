import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AuthErrorCodes,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { BaseButton, BaseInput, BaseLoader } from "../../components";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import { app } from "../../utils/firebaseConfig";
import { useAppDispatch } from "../../redux/store/configureStore";
import { getUserDetails, setUser } from "../../redux/slices/UserSlice";
import { getDocument } from "../../utils/databaseHelper";
import { AppColors } from "../../assets/colors/AppColors";

const LoginValidationSchema = Yup.object({
  email: Yup.string().required("* Please enter your e-mail"),
  password: Yup.string().required("* Please enter your password"),
});

const LoginScreen = () => {
  const styles = useStyles();
  const navigation = useCustomNavigation("Login");

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);

  const { values, errors, handleChange, handleSubmit, handleBlur, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: LoginValidationSchema,
      onSubmit: (values) => {
        console.log({ values });
        setIsLoading(true);
        const auth = getAuth(app);

        signInWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            dispatch(getUserDetails({ uid: user.uid }))
              .unwrap()
              .then((_user) => {
                navigation.reset({
                  routes: [
                    {
                      name: "Drawer",
                    },
                  ],
                  index: 0,
                });
              })
              .catch((error) => {
                console.log({ error });
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log({ errorCode, errorMessage });
            switch (errorCode) {
              case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
                Alert.alert("Error", "Invalid credential !");
                break;
              case AuthErrorCodes.INVALID_EMAIL:
                Alert.alert("Error", "E-mail is not a valid !");
                break;
              default:
                Alert.alert("Error", `${errorCode} : Something went wrong !`);
                break;
            }
            setIsLoading(false);
          });
      },
    });

  return (
    <View style={styles.container}>
      {isLoading && <BaseLoader />}
      <View style={styles.headerCotainer}>
        <Text style={styles.headerText}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <BaseInput
          placeholder="E-mail"
          onChangeText={handleChange("email")}
          value={values.email}
          keyboardType="email-address"
          errorText={touched.email && errors.email}
          onBlur={handleBlur("email")}
        />
        <BaseInput
          placeholder="Password"
          onChangeText={handleChange("password")}
          value={values.password}
          isPasswordField={true}
          secureTextEntry={isSecureTextEntry}
          onSecureTextEntryPress={() =>
            setIsSecureTextEntry(!isSecureTextEntry)
          }
          errorText={touched.password && errors.password}
          onBlur={handleBlur("password")}
        />
        <BaseButton title="Login" onPress={() => handleSubmit()} />
        <Text
          onPress={() => {
            navigation.navigate("Register");
          }}
          style={styles.notHaveAccount}
        >
          {"Don't have an Account? Register Now"}
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();

  return StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
    },
    headerCotainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    headerText: {
      fontSize: 28,
      fontWeight: "600",
      color: AppColors.PRIMARY_TEXT,
    },
    formContainer: {
      flex: 1,
    },
    notHaveAccount: {
      textAlign: "center",
      margin: hp(1.5),
      color: AppColors.PRIMARY,
    },
  });
};
