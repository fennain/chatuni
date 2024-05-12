import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { RootState, useSelector, useDispatch } from "@/redux";
import { shallowEqual } from "react-redux";
import { setGlobalState } from "@/redux/modules/global";
import { TabBar } from "antd-mobile";
import { Avatar, Menu } from "antd";
import type { MenuProps } from "antd";
import useRequest from "@/hooks/useRequest";
import SvgIcon from "@/components/SvgIcon";
import defaultAvatar from "@/assets/images/defaultAvatar.png";
import Login from "./login";
import { useNavigate, Link } from "react-router-dom";

const LayoutIndex: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getToken } = useRequest();
  const token = useSelector((state: RootState) => state.user.token);

  // useEffect(() => {
  //   if (!token) {
  //     getToken();
  //   }
  // }, [getToken, token]);

  const tabs = [
    {
      key: "tutors",
      path: "/",
      title: "外教",
      label: <Link to="/">外教</Link>,
      icon: <SvgIcon className="desktop:text-[28px]" name="tutors" />,
    },
    {
      key: "course",
      path: "/level",
      title: "课程",
      label: <Link to="/level">课程</Link>,
      icon: <SvgIcon className="desktop:text-[28px]" name="course" />,
    },
    {
      key: "me",
      path: "/me",
      title: "我的",
      label: <Link to="/me">我的</Link>,
      icon: <SvgIcon className="desktop:text-[28px]" name="me" />,
    },
    {
      key: "yuan",
      title: "元宇宙",
      label: (
        <a href="http://chatuni.smartkit.vip/webgl/" target="_blank">
          元宇宙
        </a>
      ),
      icon: <SvgIcon className="desktop:text-[28px]" name="rocket" />,
    },
  ];

  const { tabbarKey } = useSelector(
    (state: RootState) => ({
      tabbarKey: state.global.tabbarKey ?? "tutors",
    }),
    shallowEqual
  );
  const onChange = (key: string) => {
    const path = tabs.find((item) => item.key == key)?.path;
    if (path) navigate(path);
    if (key == "yuan") {
      window.open("http://chatuni.smartkit.vip/webgl/");
      return;
    }
    dispatch(setGlobalState({ key: "tabbarKey", value: key }));
  };

  const onClick_pc: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    if (e.key != "yuan")
      dispatch(setGlobalState({ key: "tabbarKey", value: e.key }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center bg-white sticky top-0 z-10 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
        <div className="ipad:hidden max-w-[1320px] w-full h-[78px] px-[30px] py-[12px] flex justify-between items-center">
          <SvgIcon name="logo" className="h-full w-[70px] text-[#3AE3B9]" />
          <Menu
            className="bg-white text-[20px] leading-[44px] border-b-0 flex-auto flex justify-center items-center"
            onClick={onClick_pc}
            selectedKeys={[tabbarKey]}
            mode="horizontal"
            items={tabs}
          />
          <div>
            <Avatar src={defaultAvatar} className="w-[56px] h-[56px]" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white overflow-hidden overflow-y-auto flex justify-center">
        <div className="max-w-[1320px] w-full h-full ipad:pt-[110px]">
          <Outlet />
        </div>
      </div>
      <TabBar
        className="ipad:block hidden h-[150px] shadow-[0_-2px_16px_rgba(0,0,0,0.08)]"
        safeArea
        activeKey={tabbarKey}
        onChange={onChange}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      <Login />
    </div>
  );
};

export default LayoutIndex;
