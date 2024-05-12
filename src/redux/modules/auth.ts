import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/redux/interface";

const authState: AuthState = {
  // 项目列表
  projectList: null,
  currentProject: undefined,
};

const authSlice = createSlice({
  name: "hooks-auth",
  initialState: authState,
  reducers: {
    setProjectList(
      state,
      { payload }: PayloadAction<AuthState["projectList"]>
    ) {
      state.projectList = payload;
    },
    setCurrentProject(
      state,
      { payload }: PayloadAction<AuthState["currentProject"]>
    ) {
      state.currentProject = payload;
    },
  },
});

export const { setProjectList, setCurrentProject } = authSlice.actions;
export default authSlice.reducer;
