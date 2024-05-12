export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  language: LanguageType;
  primary: string;
  isDark: boolean;
  tabbarKey: string;
  courseKey: number;
}

/* UserState */
export interface UserState {
  token: string | null;
  currentDay: number;
  currentSentence: number;
  userInfo: {
    sex: "0" | "1";
    nickname: string;
    phone: string;
    usageduration: string;
    remainingduration: string;
    giftduration: string;
    userid: string;
    openid: string;
  };

  Grades:
    | {
        lesson: number;
        grade_1: number[];
        grade_2: number[];
        grade_3: number[];
      }[]
    | null;
}

/* AuthState */
export interface AuthState {
  projectList: null;
  currentProject: string | undefined;
}
