import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/redux/interface";

const initUserInfo = {
  sex: "1",
  nickname: "",
  phone: "",
  usageduration: "0",
  remainingduration: "0",
  giftduration: "0",
  userid: "",
  openid: "",
};

const userState: UserState = {
  token: null,
  userInfo: initUserInfo,
  currentDay: 1,
  currentSentence: 1,
  //
  Grades: null,
};

const globalSlice = createSlice({
  name: "hooks-user",
  initialState: userState,
  reducers: {
    setToken(state, { payload }: PayloadAction<string>) {
      state.token = payload;
    },
    setCurrentDay(state, { payload }: PayloadAction<number>) {
      state.currentDay = payload;
    },
    setCurrentSentence(state, { payload }: PayloadAction<number>) {
      state.currentSentence = payload;
    },
    setUserInfo(state, { payload }: PayloadAction<UserState["userInfo"]>) {
      state.userInfo = { ...state.userInfo, ...payload };
    },
    resetUserInfo(state) {
      state.userInfo = initUserInfo;
    },
    //
    setGrades(state, { payload }: PayloadAction<UserState["Grades"]>) {
      state.Grades = payload;
    },
  },
});

export const {
  setToken,
  setCurrentDay,
  setCurrentSentence,
  setUserInfo,
  setGrades,
  resetUserInfo
} = globalSlice.actions;
export default globalSlice.reducer;
