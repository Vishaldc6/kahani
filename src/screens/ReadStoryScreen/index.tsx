import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

import { BaseButton, BaseHeader, BaseLoader } from "../../components";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootNavigation";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/store/configureStore";
import { getStoryData, Visibility } from "../../redux/slices/StorySlice";
import { AppColors } from "../../assets/colors/AppColors";
import { removeDocument, updateDocument } from "../../utils/databaseHelper";

const ReadStoryScreen = () => {
  const navigation = useCustomNavigation("ReadStory");
  const { params } = useRoute<RouteProp<RootStackParamList, "ReadStory">>();
  const styles = useStyles();

  const { user } = useAppSelector((state) => state.UserReducer);
  const { storyData } = useAppSelector((state) => state.StoryReducer);
  const dispatch = useAppDispatch();

  const [isMenuVisiable, setIsMenuVisiable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params?._id) {
      dispatch(
        getStoryData({
          _id: params._id,
        })
      );
    }
  }, []);

  const handleLikeStory = () => {};

  const handleContextMenu = () => {
    setIsMenuVisiable(!isMenuVisiable);
  };

  const handleReport = () => {
    Linking.openURL(
      `mailto:vishal.chaudhary452003@gmail.com?subject=Report on story: ${storyData?.title}&body=[Enter your issue]`
    );
  };

  const handleArchivedStory = () => {
    handleContextMenu();
    setIsLoading(true);
    updateDocument("Stories", storyData?.id, {
      archived: true,
    })
      .then(() => {
        setIsLoading(false);
        Alert.alert("Archive story", "Story archived successfully !");
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        console.log({ error });
        Alert.alert("Error", "Story archived failed !!");
      });
  };

  const handleChnageVisibility = () => {
    handleContextMenu();
    setIsLoading(true);
    updateDocument("Stories", storyData?.id, {
      visibility:
        storyData?.visibility == Visibility.PRIVATE
          ? Visibility.EVERYONE
          : Visibility.PRIVATE,
    })
      .then(() => {
        setIsLoading(false);
        // Alert.alert("Story visibility", "");
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        console.log({ error });
        Alert.alert("Error", "Something went wrong !!");
      });
  };

  const handleConfirmDeleteStory = () => {
    Alert.alert(
      "Delete story",
      `Are you sure you want to delete story: ${storyData?.title}?`,
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: handleDeleteStory,
        },
      ]
    );
  };

  const handleDeleteStory = () => {
    handleContextMenu();
    setIsLoading(true);
    removeDocument("Stories", storyData?.id)
      .then(() => {
        setIsLoading(false);
        Alert.alert("Delete story", "Story deleted successfully !");
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        console.log({ error });
        Alert.alert("Error", "Story deletion failed !!");
      });
  };

  return (
    <>
      <BaseHeader
        title={storyData?.title}
        leftIcon="chevron-back"
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon="ellipsis-vertical"
        rightIconPress={handleContextMenu}
      />
      {isLoading && <BaseLoader />}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.contentTxt}>{storyData?.content}</Text>
        </ScrollView>
        {/* <View style={styles.btnRowContainer}>
          <BaseButton
            title="Like"
            prefixIcon={"heart"}
            style={{ flex: 1 }}
            onPress={handleLikeStory}
          />
           <BaseButton title="Share" style={{ flex: 1 }} /> 
        </View> */}
      </View>

      <Modal
        transparent
        statusBarTranslucent
        visible={isMenuVisiable}
        animationType="fade"
        onRequestClose={handleContextMenu}
      >
        <TouchableOpacity
          style={styles.menuModalContainer}
          onPress={handleContextMenu}
          activeOpacity={1}
        >
          <View style={styles.menuContent}>
            {storyData?.author_id === user.id ? (
              <>
                {/* <Text
                  style={[styles.menuOptionTxt, { color: AppColors.BLACK }]}
                >
                  {"Edit"}
                </Text> */}
                <Text
                  style={styles.menuOptionTxt}
                  onPress={handleArchivedStory}
                >
                  {"Archive"}
                </Text>
                <Text
                  style={styles.menuOptionTxt}
                  onPress={handleChnageVisibility}
                >
                  {"Visible to"}&nbsp;
                  {storyData?.visibility == Visibility.PRIVATE
                    ? "everyone"
                    : "you only"}
                </Text>
                <Text
                  style={[styles.menuOptionTxt, styles.warningOptionTxt]}
                  onPress={handleConfirmDeleteStory}
                >
                  {"Delete"}
                </Text>
              </>
            ) : (
              <Text
                style={[styles.menuOptionTxt, styles.warningOptionTxt]}
                onPress={handleReport}
              >
                {"Report"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ReadStoryScreen;

const useStyles = () => {
  const { hp, wp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
      paddingVertical: hp(1),
    },
    contentContainer: {
      borderWidth: 2,
      borderColor: AppColors.PRIMARY,
      padding: wp(4),
      borderRadius: wp(2),
      backgroundColor: AppColors.SECONDARY_BACKGROUND,
    },
    contentTxt: {
      fontSize: 18,
    },
    btnRowContainer: {
      flexDirection: "row",
    },
    menuModalContainer: {
      backgroundColor: AppColors.TRANSPARENT,
      flex: 1,
      justifyContent: "flex-end",
    },
    menuContent: {
      backgroundColor: AppColors.WHITE,
      padding: wp(5),
      borderTopLeftRadius: wp(5),
      borderTopRightRadius: wp(5),
      gap: hp(1.2),
    },
    menuOptionTxt: {
      fontSize: 18,
      textAlign: "center",
      marginVertical: wp(1),
    },
    warningOptionTxt: {
      color: AppColors.ERROR,
    },
  });
};
