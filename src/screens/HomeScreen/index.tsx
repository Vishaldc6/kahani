import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  and,
  collection,
  onSnapshot,
  or,
  query,
  where,
} from "firebase/firestore";
import { DrawerActions } from "@react-navigation/native";

import useCustomWindowDimensions from "../../hooks/useCustomWindowDimensions";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { AppColors } from "../../assets/colors/AppColors";
import { db } from "../../utils/firebaseConfig";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/store/configureStore";
import { setStoryList, StoryType } from "../../redux/slices/StorySlice";
import { BaseHeader, BaseLoader } from "../../components";
import { AppQuotes } from "../../assets/quotes/AppQuotes";

const HomeScreen = () => {
  const styles = useStyles();
  const navigation = useCustomNavigation("Home");

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.UserReducer);
  const { storyList } = useAppSelector((state) => state.StoryReducer);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "Stories"),
      and(
        where("archived", "==", false),
        or(
          and(where("visibility", "==", "EVERYONE")),
          and(
            where("visibility", "==", "PRIVATE"),
            where("author_id", "==", user.id)
          )
        )
      )
      // orderBy("created_at")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let _storyList: StoryType[] = [];

      querySnapshot.forEach((doc) => {
        _storyList.push(doc.data() as StoryType);
      });

      setIsLoading(false);
      dispatch(setStoryList(_storyList));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderStoryCard = ({ item }: { item: StoryType }) => {
    const isLiked = item.liked_by.find((val) => val === user.id);
    const iconType =
      item.type == "TEXT" ? "document-text-outline" : "image-outline";
    // const iconType =
    //   item.type == "image"
    //     ? "image-outline"
    //     : item.type == "pdf"
    //     ? "document-text-outline"
    //     : item.type == "audio"
    //     ? "headset-outline"
    //     : "videocam-outline";

    return (
      <TouchableOpacity
        style={styles.storyCardContainer}
        onPress={() =>
          navigation.navigate("ReadStory", {
            _id: item.id,
          })
        }
      >
        <View style={styles.storyType}>
          <Ionicons name={iconType} size={60} color={AppColors.PRIMARY_TEXT} />
        </View>
        <View style={styles.storyDetailContainer}>
          <Text style={styles.titleTxt} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.likeContainer}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={AppColors.PRIMARY}
            />
            {!!item.liked_by.length && (
              <Text style={styles.likesTxt} numberOfLines={1}>
                {item.liked_by.length}
              </Text>
            )}
          </View>
          {/* <Text style={styles.ownerTxt} numberOfLines={1}>
            {item.author_id ?? "Unknown"}
          </Text> */}
        </View>
        {item?.visibility == "PRIVATE" && (
          <Ionicons
            name={"lock-closed-outline"}
            size={25}
            color={AppColors.PRIMARY_TEXT}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => {
    const [index, setIndex] = useState(0);
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTxt}>
          {"There is no one story is added yet !"}
          <Text style={styles.subEmptyTxt}>
            {"Meanwhile you can just read this"}
            {`\n\n${AppQuotes[index]}\n`}
          </Text>
        </Text>
        <Ionicons
          name="refresh"
          size={24}
          color={AppColors.PRIMARY}
          onPress={() => setIndex((i) => (AppQuotes.length - 1 == i ? 0 : ++i))}
          style={styles.refreshIcon}
        />
      </View>
    );
  };

  return (
    <>
      <BaseHeader
        title="Home"
        leftIcon="menu"
        leftIconPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
      />
      {isLoading && <BaseLoader />}
      <View style={styles.container}>
        <FlatList
          data={storyList}
          renderItem={renderStoryCard}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.flatListContentStyle}
          style={styles.listStyle}
          showsVerticalScrollIndicator={false}
        />
        {/* floating button */}
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

export default HomeScreen;

const useStyles = () => {
  const { wp, hp } = useCustomWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(5),
    },
    storyCardContainer: {
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
    storyDetailContainer: {
      flex: 1,
      rowGap: wp(1.2),
    },
    titleTxt: {
      fontSize: 22,
      color: AppColors.PRIMARY_TEXT,
    },
    likesTxt: {
      fontSize: 18,
      color: AppColors.PRIMARY_TEXT,
    },
    ownerTxt: {
      fontSize: 16,
    },
    likeContainer: {
      flexDirection: "row",
      alignItems: "center",
      columnGap: wp(1.2),
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
    subEmptyTxt: {
      fontSize: 16,
      fontStyle: "italic",
    },
    refreshIcon: {
      marginVertical: hp(1),
    },
  });
};
