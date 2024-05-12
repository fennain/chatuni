import React, { useEffect } from "react";
import { RootState, useSelector } from "@/redux";
import { MetaProps } from "@/routers/interface";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config";

/**
 * @description 路由守卫组件
 */
interface RouterGuardProps {
  children: React.ReactNode;
}

const RouterGuard: React.FC<RouterGuardProps> = (props) => {
  const loader = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  // Mount navigate to provide non-React function components or calls in custom React Hook functions
  window.$navigate = navigate;

  const token = useSelector((state: RootState) => state.user.token);

  

  useEffect(() => {
    const meta = loader as MetaProps;
    
    if (meta.title) {
      const title = import.meta.env.VITE_GLOB_APP_TITLE;
      document.title = meta?.title ? `${meta.title} - ${title}` : title;
    }

    // 白名单页面直接返回
    if (ROUTER_WHITE_LIST.includes(location.pathname)) return;

    // Whether login page
    const isLoginPage = location.pathname === LOGIN_URL;

    // 如果没有token并且不是登录页面，跳转到登录页面
    console.log(location);
    // if (!token && !isLoginPage) {
    //   return navigate(LOGIN_URL, { replace: true });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader]);

  return props.children;
};

export default RouterGuard;
