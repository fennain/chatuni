import { useState, useEffect } from "react";
import {
  RouterProvider as Router,
  RouteObject,
  createHashRouter,
  createBrowserRouter,
} from "react-router-dom";
import { wrappedStaticRouter } from "./modules/staticRouter";
import { RouteObjectType } from "./interface";
import useMessage from "@/hooks/useMessage";

const mode = import.meta.env.VITE_ROUTER_MODE;

/**
 * @description Route file entry
 */
const RouterProvider: React.FC = () => {
  // useTheme && useMessage
  //   useTheme();
  useMessage();

  const [routerList] = useState<RouteObjectType[]>(wrappedStaticRouter);

  // useEffect(() => {
  //   // 当刷新页面时，如果没有projectList，则触发权限初始化
  //   console.log("触发", projectList);
  //   if (!projectList) {
  //     // 请求projectList
  //     initPermissions(token);

  //     return;
  //   }
  //   const dynamicRouter = convertToDynamicRouterFormat(projectList);
  //   // 等projectList列表有值后，把*路由匹配加载页面换成404页面
  //   const allRouter = [...wrappedStaticRouter];
  //   allRouter.forEach((item) => {
  //     if (item.path === "*") {
  //       item.element = <NotFound />;
  //     } else if (item.path === "/") {
  //       item.children?.push(...dynamicRouter);
  //     }
  //   });
  //   setRouterList(allRouter);
  //   console.log(allRouter);
  // }, [projectList]);

  const routerMode = {
    hash: () => createHashRouter(routerList as RouteObject[]),
    history: () =>
      createBrowserRouter(routerList as RouteObject[], {
        basename: import.meta.env.VITE_PUBLIC_PATH,
      }),
  };

  return <Router router={routerMode[mode]()} />;
};

export default RouterProvider;
