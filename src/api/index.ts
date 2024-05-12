import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {
  showFullScreenLoading,
  tryHideFullScreenLoading,
} from "@/components/Loading/fullScreen";
import { LOGIN_URL } from "@/config";
import { Result } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { message } from "@/hooks/useMessage";
import { setToken } from "@/redux/modules/user";
import { checkStatus } from "./helper/checkStatus";
import { store } from "@/redux";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean; // 是否显示加载动画
}

const config = {
  // 默认请求地址，可以在.env.**文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 允许跨域携带凭证
  withCredentials: false,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token验证(JWT)：接收服务器返回的token，并存储在redux/local storage中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        // 当前请求需要显示加载动画，由API服务中指定的第三个参数控制：{loading: true}
        config.loading && showFullScreenLoading();
        if (config.headers && typeof config.headers.set === "function") {
          store.getState().user.token &&
            config.headers.set("Authorization", `${store.getState().user.token}`);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     * 服务器返回信息 -> [统一拦截处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        tryHideFullScreenLoading();
        // 登录失败
        if (data.status == ResultEnum.OVERDUE) {
          store.dispatch(setToken(""));
          message.error("登录过期，请重新登录");
          // window.$navigate(LOGIN_URL);
          return Promise.reject(data);
        }
        // 全局错误信息拦截（为防止下载文件时返回数据流，直接报错无code）
        if (data.status && data.status != ResultEnum.SUCCESS) {
          message.error(data.message || data.result);
          return Promise.reject(data);
        }
        // 请求成功（除非有特殊情况，否则页面无需处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        tryHideFullScreenLoading();
        // console.log(response);

        // // 服务器错误信息拦截
        // if (response && response.data) {
        //   const data = response.data as Result;
        //   message.error(data.message);

        //   if (response.status === 401) {
        //     Cookies.remove("token");
        //     window.$navigate(LOGIN_URL);
        //   }
        //   return Promise.reject(data);
        // }

        // 请求超时 && 网络错误单独判断，没有response
        if (error.message.indexOf("timeout") !== -1)
          message.error("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1)
          message.error("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码做不同处理
        if (response) checkStatus(response.status);
        // 服务器没有返回任何结果（可能是服务器出错或客户端断开了网络），断网处理：可以跳转到断网页面
        if (!window.navigator.onLine) window.$navigate("/500");
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 通用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(
    url: string,
    params?: object | string,
    _object = {}
  ): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(
    url: string,
    params?: unknown,
    _object = {}
  ): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

export default new RequestHttp(config);
