import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { BaseHeader, BaseLoader } from "../../components";
import { DrawerActions } from "@react-navigation/native";
import { AppColors } from "../../assets/colors/AppColors";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { StoryType } from "../../redux/slices/StorySlice";
import { useAppSelector } from "../../redux/store/configureStore";
import { updateDocument } from "../../utils/databaseHelper";

const ArchivedStoryScreen = () => {
  const styles = useStyles();

  const navigation = useCustomNavigation("ArchivedStory");

  const { user } = useAppSelector((state) => state.UserReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [archivedList, setArchivedList] = useState<StoryType[]>();
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState();

  useEffect(() => {
    const q = query(
      collection(db, "Stories"),
      where("archived", "==", true),
      where("author_id", "==", user.id)
      // orderBy("created_at")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let _storyList: StoryType[] = [];

      querySnapshot.forEach((doc) => {
        console.log({ data: doc.data() });
        _storyList.push(doc.data() as StoryType);
      });

      setIsLoading(false);
      setArchivedList(_storyList);
      //   dispatch(setStoryList(_storyList));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderStoryCard = ({ item }) => {
    const iconType =
      item.type == "TEXT" ? "document-text-outline" : "image-outline";
    return (
      <View style={styles.storyCard}>
        <View style={styles.storyType}>
          <Ionicons name={iconType} size={60} color={AppColors.PRIMARY_TEXT} />
        </View>
        <Text style={styles.titleTxt} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedStoryId(item.id);
            handleContextMenu();
          }}
        >
          <Ionicons
            name={"ellipsis-vertical"}
            size={25}
            color={AppColors.PRIMARY_TEXT}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTxt}>{"No one story is archived yet !"}</Text>
      </View>
    );
  };

  const handleContextMenu = () => {
    setIsOptionVisible(!isOptionVisible);
  };

  const handleUnArchivedStory = () => {
    handleContextMenu();
    setIsLoading(true);
    updateDocument("Stories", selectedStoryId, {
      archived: false,
    })
      .then(() => {
        setIsLoading(false);
        Alert.alert("Archive story", "Story available to home page !");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log({ error });
        Alert.alert("Error", "Story un-archiving failed !!");
      });
  };

  return (
    <>
      <BaseHeader
        title="Archived Story"
        leftIcon="menu"
        leftIconPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      />
      {isLoading && <BaseLoader />}
      <View style={styles.container}>
        <FlatList
          data={archivedList}
          renderItem={renderStoryCard}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.flatListContentStyle}
          style={styles.listStyle}
          showsVerticalScrollIndicator={false}
        />
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
            <Text style={styles.menuOptionTxt} onPress={handleUnArchivedStory}>
              {"Remove from archive"}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ArchivedStoryScreen;

const useStyles = () => {
  const { wp, hp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
    },
    listStyle: {
      marginVertical: "2%",
    },
    flatListContentStyle: {
      flexGrow: 1,
    },
    storyCard: {
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
    },
    titleTxt: {
      flex: 1,
      fontSize: 20,
      color: AppColors.PRIMARY_TEXT,
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
      color: AppColors.ERROR,
    },
  });
};
