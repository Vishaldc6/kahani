import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

export const USER = "USER";

type InitialStateType = {
  user: UserType | undefined;
  isLoading: boolean;
};

interface UserType {
  id: string;
  uid: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

const initialState: InitialStateType = {
  user: undefined,
  isLoading: false,
};

export const getUserDetails = createAsyncThunk<
  UserType,
  { uid: string },
  { rejectValue: any }
>(USER + "/getUserDetails", async ({ uid }, { rejectWithValue }) => {
  try {
    const _doc = query(collection(db, "Users"), where("uid", "==", uid));
    const res = await getDocs(_doc);

    const _userData = res.docs[0].data() as UserType;

    return {
      email: _userData.email,
      id: _userData.id,
      name: _userData.name,
      uid: _userData.uid,
      created_at: _userData.created_at,
      updated_at: _userData.updated_at,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const UserSlice = createSlice({
  initialState: initialState,
  name: USER,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getUserDetails.fulfilled,
      (state, action: PayloadAction<UserType>) => {
        state.user = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(getUserDetails.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default UserSlice.reducer;
export const { setUser } = UserSlice.actions;
