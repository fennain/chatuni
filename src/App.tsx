import React, { useEffect } from "react";
import { theme, ConfigProvider, App as AppProvider, ThemeConfig } from "antd";
import { StyleProvider, px2remTransformer } from "@ant-design/cssinjs";
import { RootState, useSelector, useDispatch } from "@/redux";
import { setGlobalState } from "@/redux/modules/global";
import { LanguageType } from "@/redux/interface";
import { shallowEqual } from "react-redux";
import { getBrowserLang } from "@/utils";
import { I18nextProvider } from "react-i18next";
import RouterProvider from "@/routers";
import i18n from "@/languages/index";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import first_read from "@/assets/json/first_read.json";
import chooseOptions from "@/assets/json/chooseOptions.json";
import { setGrades } from "@/redux/modules/user";

import { useSetDomWidth, useBasicLayout } from "@/hooks/useBasicLayout";

const App: React.FC = () => {
  useSetDomWidth();
  const dispatch = useDispatch();
  // const { isIpad } = useBasicLayout();

  // const isMobile = window.innerWidth <= 640;
  const px2rem = px2remTransformer({
    rootValue: 37.5, // 37.5px = 1rem; @default 16
  });

  const { isDark, primary, language } = useSelector(
    (state: RootState) => ({
      isDark: state.global.isDark,
      primary: state.global.primary,
      language: state.global.language,
    }),
    shallowEqual
  );

  // init theme algorithm
  const algorithm = () => {
    const algorithmArr = isDark
      ? [theme.darkAlgorithm]
      : [theme.defaultAlgorithm];
    return algorithmArr;
  };

  // init language
  const initLanguage = () => {
    const result = language ?? getBrowserLang();
    dispatch(
      setGlobalState({ key: "language", value: result as LanguageType })
    );
    i18n.changeLanguage(language as string);
    dayjs.locale(language === "zh" ? "zh-cn" : "en");
  };

  useEffect(() => {
    initLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const themeToken: ThemeConfig = {
    token: {
      colorPrimary: "#3AE3B9",
      // borderRadius: 12,
      // colorPrimaryHover: "",
      // colorPrimaryActive: "",
    },
    components: {
      Tabs: {
        titleFontSizeLG: 20,
      },
      Menu: {
        // itemColor: "#ffffff",
        // horizontalItemSelectedColor: "#ffffff",
        itemHoverColor: "#3AE3B9",
        itemPaddingInline: "32px",
      },
    },
    algorithm: algorithm(),
  };

  console.log("app重新渲染");

  const Grades = useSelector((state: RootState) => state.user.Grades);

  useEffect(() => {
    if (!Grades) {
      dispatch(
        setGrades(
          first_read.map((item, index) => {
            return {
              lesson: item.id,
              grade_1: item.content.map(() => 0),
              grade_2: chooseOptions[index].content.map(() => 0),
              grade_3: chooseOptions[index].content.map(() => 0),
            };
          })
        )
      );
    }

    // console.log(Grades);
  }, []);

  return (
    <StyleProvider hashPriority="high" transformers={undefined}>
      <ConfigProvider
        locale={zhCN}
        autoInsertSpaceInButton={true}
        theme={themeToken}
      >
        <AppProvider message={{ maxCount: 1 }}>
          <I18nextProvider i18n={i18n}>
            <RouterProvider />
          </I18nextProvider>
        </AppProvider>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default App;
