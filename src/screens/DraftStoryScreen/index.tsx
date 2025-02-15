import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppSelector } from "../../redux/store/configureStore";
import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import { Ionicons } from "@expo/vector-icons";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { BaseHeader } from "../../components";
import { AppColors } from "../../assets/colors/AppColors";
import { DrawerActions } from "@react-navigation/native";

const DraftStoryScreen = () => {
  const styles = useStyles();

  const navigation = useCustomNavigation("DraftStory");
  const { draftStoryList } = useAppSelector((state) => state.StoryReducer);

  const handleDraftCardPress = (item) => {
    navigation.navigate("AddStory", {
      content: item.content,
      title: item.title,
      id: item.id,
      visibility: item.visibility,
    });
  };

  const renderDraftCard = ({ item }) => {
    const iconType =
      item.type == "TEXT" ? "document-text-outline" : "image-outline";
    return (
      <TouchableOpacity
        style={styles.draftStoryCard}
        onPress={() => handleDraftCardPress(item)}
      >
        <View style={styles.storyType}>
          <Ionicons name={iconType} size={60} color={AppColors.PRIMARY_TEXT} />
        </View>
        <Text style={styles.titleTxt} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTxt}>
          {"No one story is added to the draft yet !"}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    console.log({ draftStoryList });

    return () => {};
  }, []);

  return (
    <>
      <BaseHeader
        title="Draft Story"
        leftIcon="menu"
        leftIconPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={draftStoryList}
          renderItem={renderDraftCard}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.flatListContentStyle}
          style={styles.listStyle}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => {
            navigation.navigate("AddStory");
          }}
        >
          <Ionicons name="add" size={40} color={AppColors.PRIMARY} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DraftStoryScreen;

const useStyles = () => {
  const { wp, hp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
    },
    draftStoryCard: {
      marginBottom: hp(1.7),
      borderWidth: 2.5,
      borderRadius: wp(5),
      borderColor: AppColors.PRIMARY,
      paddingHorizontal: wp(2),
      paddingVertical: wp(1.3),
      flexDirection: "row",
      alignItems: "center",
      columnGap: wp(2),
    },
    storyType: {
      justifyContent: "center",
      alignItems: "center",
      height: wp(18),
      width: wp(18),
      borderRadius: wp(3),
    },
    listStyle: {
      marginVertical: "2%",
    },
    flatListContentStyle: {
      flexGrow: 1,
    },
    emptyContainer: {
      height: "90%",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyTxt: {
      textAlign: "center",
      color: AppColors.PRIMARY_TEXT,
      fontSize: 18,
    },
    floatingBtn: {
      bottom: hp(3),
      right: wp(7),
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2.5,
      borderRadius: wp(50),
      height: wp(15),
      width: wp(15),
      borderColor: AppColors.PRIMARY,
      backgroundColor: AppColors.SECONDARY,
    },
    titleTxt: {
      fontSize: 20,
      color: AppColors.PRIMARY_TEXT,
    },
  });
};
