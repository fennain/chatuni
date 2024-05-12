import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalState } from "@/redux/interface";
import { DEFAULT_PRIMARY } from "@/config";

const globalState: GlobalState = {
  // current system language
  language: "zh",
  // theme color
  primary: DEFAULT_PRIMARY,
  // dark mode
  isDark: false,
  tabbarKey: "tutors",
  courseKey: 0,
};

const globalSlice = createSlice({
  name: "hooks-global",
  initialState: globalState,
  reducers: {
    setGlobalState<T extends keyof GlobalState>(
      state: GlobalState,
      { payload }: PayloadAction<ObjToKeyValUnion<GlobalState>>
    ) {
      state[payload.key as T] = payload.value as GlobalState[T];
    },
  },
});

export const { setGlobalState } = globalSlice.actions;
export default globalSlice.reducer;
