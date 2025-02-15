import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  updateProfile,
} from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";

import { app } from "../../utils/firebaseConfig";
import { BaseButton, BaseInput, BaseLoader } from "../../components";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import { useAppDispatch } from "../../redux/store/configureStore";
import { setUser } from "../../redux/slices/UserSlice";
import { addDocument, generateUniqueId } from "../../utils/databaseHelper";
import { AppColors } from "../../assets/colors/AppColors";

const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .required("* Please enter your name")
    .min(3, "* Name should be at least 3 characters"),
  email: Yup.string()
    .email("* E-mail should be valid")
    .required("* Please enter your e-mail"),
  password: Yup.string()
    .required("* Please enter your password")
    .min(8, "* Password should be at least 8 characters"),
});

const RegisterScreen = () => {
  const styles = useStyles();
  const navigation = useCustomNavigation("Register");

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState<boolean>(true);

  const { values, errors, handleChange, handleSubmit, touched, handleBlur } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema: RegisterValidationSchema,
      onSubmit: (values) => {
        setIsLoading(true);

        const auth = getAuth(app);

        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            updateProfile(auth.currentUser, {
              displayName: values.name,
            }).then(async () => {
              const userCred = userCredential.user;

              const _uniqueId = await generateUniqueId("Users", "id");
              const _user = {
                id: _uniqueId,
                email: userCred.email,
                uid: userCred.uid,
                name: userCred.displayName,
              };

              dispatch(setUser(_user));

              addDocument("Users/", _user.id, _user)
                .then(() => {
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
                  Alert.alert("Error", "Something went wrong !");
                  setIsLoading(false);
                });
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log({ errorCode, errorMessage });
            switch (errorCode) {
              case AuthErrorCodes.EMAIL_EXISTS:
                Alert.alert(
                  "Error",
                  "Already have an account with this e-mail !"
                );
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

  useEffect(() => {
    console.log({ values, touched, errors });
  }, [values, touched, errors]);

  return (
    <View style={styles.container}>
      {isLoading && <BaseLoader />}
      <View style={styles.headerCotainer}>
        <Text style={styles.headerText}>Register</Text>
      </View>

      <View style={styles.formContainer}>
        <BaseInput
          placeholder="Name"
          onChangeText={handleChange("name")}
          value={values.name}
          errorText={touched.name && errors.name}
          onBlur={handleBlur("name")}
        />
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
        <BaseButton title="Register" onPress={() => handleSubmit()} />

        <Text
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.alreadyAccount}
        >
          {"Already have an Account?"}
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
    alreadyAccount: {
      textAlign: "center",
      margin: hp(1.5),
      color: AppColors.PRIMARY,
    },
  });
};
