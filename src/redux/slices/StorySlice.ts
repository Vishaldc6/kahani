import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORY = "STORY";

export enum Visibility {
  EVERYONE = "EVERYONE", // Explicitly assign string values
  PRIVATE = "PRIVATE",
}

export interface StoryType {
  id: string;
  title: string;
  type: "TEXT" | "FILE";
  author_id: string;
  liked_by: string[];
  content?: string;
  file_link?: string;
  created_at?: string;
  updated_at?: string;
  visibility?: Visibility;
  archived?: boolean;
}

type InitialStateType = {
  isLoading: boolean;
  storyList: StoryType[];
  draftStoryList: Partial<StoryType>[];
  storyData: StoryType;
};

const initialState: InitialStateType = {
  isLoading: false,
  storyList: [],
  draftStoryList: [],
  storyData: undefined,
};

export const StorySlice = createSlice({
  initialState: initialState,
  name: STORY,
  reducers: {
    setStoryList(state, action: PayloadAction<StoryType[]>) {
      state.storyList = action.payload;
    },

    getStoryData(state, action: PayloadAction<{ _id: string }>) {
      state.storyData = state.storyList.find(
        ({ id }) => id == action.payload._id
      );
    },

    updateStoryData(state, action: PayloadAction<Partial<StoryType>>) {
      state.storyData = { ...state.storyData, ...action.payload };
    },

    addDraftStory(state, action: PayloadAction<Partial<StoryType>>) {
      const storyData: Partial<StoryType> = {
        content: action.payload.content,
        id: (state.draftStoryList.length + 1).toString(),
        title: action.payload.title,
        type: action.payload.type,
        visibility: action.payload.visibility,
      };
      state.draftStoryList = [...state.draftStoryList, storyData];
    },

    updateDraftStory(state, action: PayloadAction<Partial<StoryType>>) {
      const foundIndex = state.draftStoryList.findIndex(
        ({ id }) => action.payload.id == id
      );

      const updatedStoryData: Partial<StoryType> = {
        content: action.payload.content,
        title: action.payload.title,
        visibility: action.payload.visibility,
      };

      state.draftStoryList[foundIndex] = {
        ...state.draftStoryList[foundIndex],
        ...updatedStoryData,
      };
    },

    removeDraftStory(state, action: PayloadAction<{ _id: string }>) {
      state.draftStoryList = state.draftStoryList.filter(
        ({ id }) => action.payload._id != id
      );
    },
  },
});

export default StorySlice.reducer;
export const {
  getStoryData,
  setStoryList,
  updateStoryData,
  addDraftStory,
  removeDraftStory,
  updateDraftStory,
} = StorySlice.actions;
