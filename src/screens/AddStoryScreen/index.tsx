import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import {
  BaseButton,
  BaseHeader,
  BaseInput,
  BaseLoader,
} from "../../components";
import { addDocument, generateUniqueId } from "../../utils/databaseHelper";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/store/configureStore";
import {
  addDraftStory,
  removeDraftStory,
  StoryType,
  updateDraftStory,
  Visibility,
} from "../../redux/slices/StorySlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootNavigation";
import { AppColors } from "../../assets/colors/AppColors";
import { Ionicons } from "@expo/vector-icons";

const StoryValidationSchema = Yup.object({
  title: Yup.string()
    .required("* Please enter your story title")
    .min(3, "* Title should be at least 3 characters"),
  content: Yup.string().required("* Please enter your story content"),
});

const visibilityList = ["Everyone", "Private"];

const AddStoryScreen = () => {
  const styles = useStyles();

  const { params } = useRoute<RouteProp<RootStackParamList, "AddStory">>();
  const navigation = useCustomNavigation("AddStory");

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.UserReducer);

  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState(visibilityList[0]);
  const [isOptionVisible, setIsOptionVisible] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    setValues,
    isValid,
    validateForm,
    setTouched,
  } = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: StoryValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const _uniqueId = await generateUniqueId("Stories", "id");
      const _storyData: StoryType = {
        id: _uniqueId,
        title: values.title,
        content: values.content,
        author_id: user.id,
        likes: 0,
        type: "TEXT",
        visibility: visibility.toUpperCase() as Visibility,
        archived: false,
      };

      addDocument("Stories", _storyData.id, _storyData)
        .then(() => {
          params?.id &&
            dispatch(
              removeDraftStory({
                _id: params.id,
              })
            );
          Alert.alert("Congrats", "Your story is posted successfully !! !", [
            {
              text: "Ok",
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          Alert.alert("Error", "Something went wrong !");
          setIsLoading(false);
        });
    },
  });

  useEffect(() => {
    console.log({ params });
    if (params?.id) {
      setValues({
        title: params.title,
        content: params.content,
      });
      setVisibility(params.visibility);
    }
  }, []);

  const handleSaveDraft = async () => {
    setTouched({
      content: true,
      title: true,
    });
    validateForm({
      title: values.title,
      content: values.content,
    }).then((res) => {
      if (Object.keys(res).length == 0) {
        if (params?.id) {
          dispatch(
            updateDraftStory({
              title: values.title,
              type: "TEXT",
              content: values.content,
              id: params.id,
              visibility: visibility,
            })
          );
        } else {
          dispatch(
            addDraftStory({
              title: values.title,
              type: "TEXT",
              content: values.content,
              visibility: visibility,
            })
          );
        }
        navigation.goBack();
      }
    });
  };

  const handleDeleteDraft = () => {
    Alert.alert(
      "Remove Draft",
      "Are you sure you want to remove this draft story?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            dispatch(
              removeDraftStory({
                _id: params.id,
              })
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleContextMenu = () => {
    setIsOptionVisible(!isOptionVisible);
  };

  return (
    <>
      <BaseHeader
        title="Add Story"
        leftIcon="chevron-back"
        leftIconPress={() => {
          navigation.goBack();
        }}
      />
      {isLoading && <BaseLoader />}
      <View style={styles.container}>
        <BaseInput
          placeholder="Story Title"
          value={values.title}
          onChangeText={handleChange("title")}
          errorText={touched.title && errors.title}
          onBlur={handleBlur("title")}
        />
        <BaseInput
          placeholder="Start your story.."
          multiline={true}
          style={styles.multiInputStyle}
          value={values.content}
          onChangeText={handleChange("content")}
          errorText={touched.content && errors.content}
          onBlur={handleBlur("content")}
        />

        <View style={styles.visibilityContainer}>
          <Text style={styles.visibleTxt}>{"Visible to"}</Text>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={handleContextMenu}
          >
            <Text style={styles.optionTxt}>{visibility}</Text>
            <Ionicons
              name={"chevron-forward"}
              size={20}
              color={AppColors.PRIMARY}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.btnRowContainer}>
          <BaseButton
            title="Save Draft"
            onPress={() => handleSaveDraft()}
            style={{ flex: 1 }}
          />
          <BaseButton
            title="Add story"
            onPress={() => handleSubmit()}
            style={{ flex: 1 }}
          />
        </View>
        {params?.id && (
          <Text style={styles.deleteDraftTxt} onPress={handleDeleteDraft}>
            {"Delete draft story"}
          </Text>
        )}
      </View>

      <Modal
        transparent
        statusBarTranslucent
        visible={isOptionVisible}
        animationType="fade"
        onRequestClose={handleContextMenu}
      >
        <TouchableOpacity
          style={styles.menuModalContainer}
          onPress={handleContextMenu}
          activeOpacity={1}
        >
          <View style={styles.menuContent}>
            {visibilityList.map((value) => {
              return (
                <Text
                  style={styles.contentTxt}
                  onPress={() => {
                    setVisibility(value);
                    handleContextMenu();
                  }}
                >
                  {value}
                </Text>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AddStoryScreen;

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.5),
    },
    multiInputStyle: {
      height: hp(25),
      textAlignVertical: "top",
    },
    btnRowContainer: {
      marginVertical: hp(2),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    deleteDraftTxt: {
      color: AppColors.ERROR,
      textAlign: "center",
    },
    optionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp(5),
    },
    optionTxt: {
      fontSize: 16,
      color: AppColors.PRIMARY,
      fontStyle: "italic",
    },
    visibilityContainer: {
      flexDirection: "row",
      gap: wp(25),
      marginHorizontal: wp(5),
      marginVertical: hp(1),
      justifyContent: "space-between",
      alignItems: "center",
    },
    visibleTxt: {
      fontSize: 16,
      color: AppColors.PRIMARY,
    },
    menuModalContainer: {
      backgroundColor: AppColors.TRANSPARENT,
      flex: 1,
      justifyContent: "center",
    },
    menuContent: {
      backgroundColor: AppColors.WHITE,
      padding: wp(5),
      borderRadius: wp(5),
      marginHorizontal: wp(10),
      gap: hp(3),
    },
    contentTxt: {
      fontSize: 18,
    },
  });
};
