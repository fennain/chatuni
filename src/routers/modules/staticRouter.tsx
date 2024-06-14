import { Navigate } from "react-router-dom";
import { RouteObjectType } from "@/routers/interface";
import NotAuth from "@/components/Error/403";
import NotFound from "@/components/Error/404";
import NotNetwork from "@/components/Error/500";
import RouterGuard from "../helper/RouterGuard";
import Layout from "@/layout/index";
import { lazy } from "react";
import LazyComponent from "@/components/Lazy";
import Wechat from "@/views/oauth/wechat";
import Order from "@/views/order/index";

/**
 * staticRouter
 */
export const staticRouter: RouteObjectType[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: LazyComponent(lazy(() => import("@/pages/Tutors.tsx"))),
        meta: {
          title: "外教",
        },
      },
      {
        path: "chat",
        element: LazyComponent(lazy(() => import("@/pages/Chat.tsx"))),
        meta: {
          title: "聊天",
        },
      },
      {
        path: "level",
        element: LazyComponent(lazy(() => import("@/views/Level/index"))),
        meta: {
          title: "选择课程",
        },
      },
      {
        path: "me",
        element: LazyComponent(lazy(() => import("@/views/me/index"))),
        meta: {
          title: "我的",
        },
      },
      {
        path: "shop",
        element: LazyComponent(lazy(() => import("@/views/shop/index"))),
        meta: {
          title: "商店",
        },
      },
      //
      {
        path: "Course/:level",
        element: LazyComponent(lazy(() => import("@/views/Course/index"))),
        meta: {
          title: "选择Chatuni课程",
        },
      },
      {
        path: "/ListenCarefully",
        element: LazyComponent(lazy(() => import("@/views/ListenCarefully/choose"))),
        meta: {
          title: "仔细听",
        },
      },
      {
        path: "/Listen&Pick",
        element: LazyComponent(lazy(() => import("@/views/Listen&Pick/choose"))),
        meta: {
          title: "英翻中",
        },
      },
      {
        path: "/ReadWithMe/day/:day",
        element: LazyComponent(lazy(() => import("@/views/ReadWithMe_day/index"))),
        meta: {
          title: "跟我读",
        },
      },
      {
        path: "/ListenCarefully/:id",
        element: LazyComponent(lazy(() => import("@/views/ListenCarefully/index"))),
        meta: {
          title: "仔细听",
        },
      },
      {
        path: "/Listen&Pick/:id",
        element: LazyComponent(lazy(() => import("@/views/Listen&Pick/index"))),
        meta: {
          title: "英翻中",
        },
      },
      // 考试相关
      {
        path: "/exam/listen_sentence/:type",
        element: LazyComponent(
          lazy(() => import("@/views/exam/sentence/choose"))
        ),
        meta: {
          title: "",
        },
      },
      {
        path: "/exam/ListenCarefully/:type",
        element: LazyComponent(
          lazy(() => import("@/views/exam/ListenCarefully/choose"))
        ),
        meta: {
          title: "",
        },
      },
      //
      {
        path: "/exam/listen_sentence/:type/:id",
        element: LazyComponent(lazy(() => import("@/views/exam/sentence/index"))),
        meta: {
          title: "",
        },
      },
      {
        path: "/exam/ListenCarefully/:type/:id",
        element: LazyComponent(lazy(() => import("@/views/exam/ListenCarefully/index"))),
        meta: {
          title: "",
        },
      },
      {
        path: "/exam/listen_mp3/:type",
        element: LazyComponent(lazy(() => import("@/views/exam/listen_mp3/index"))),
        meta: {
          title: "听力训练",
        },
      },
    ],
  },
  {
    path: "/oauth/wechat",
    element: <Wechat />,
    meta: {
      title: "微信登录",
    },
  },
  {
    path: "/order",
    element: <Order />,
    meta: {
      title: "支付成功",
    },
  },
  // error pages
  {
    path: "/403",
    element: <NotAuth />,
    meta: {
      title: "403",
    },
  },
  {
    path: "/404",
    element: <NotFound />,
    meta: {
      title: "404",
    },
  },
  {
    path: "/500",
    element: <NotNetwork />,
    meta: {
      title: "500",
    },
  },
  //
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

// 添加路由守卫
function addRouterGuard(routes: RouteObjectType[]): RouteObjectType[] {
  return routes.map((route: RouteObjectType) => {
    if (route.children && route.children.length > 0) {
      // 递归处理子路由
      return {
        ...route,
        children: addRouterGuard(route.children),
      };
    } else {
      // 没有子路由时，添加守卫
      return {
        ...route,
        element:
          route.path === "*" ? (
            route.element
          ) : (
            <RouterGuard>{route.element}</RouterGuard>
          ),
        loader: () => {
          return { ...route.meta };
        },
      };
    }
  });
}

// 添加守卫后的路由表
export const wrappedStaticRouter = addRouterGuard(staticRouter);
