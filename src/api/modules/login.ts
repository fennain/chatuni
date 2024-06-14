import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

/**
 * @name AuthModule
 */
// User login
export const loginApi = (params: Login.loginReq) => {
  return http.post<any>(
    `/login/login`,
    {
      ...params,
      system: 3,
    },
    {
      // baseURL: "http://192.168.199.30:9010",
    }
  );
  // return http.post<ResLogin>(PORT1 + `/login`, params, { loading: false });
  // return http.post<ResLogin>(PORT1 + `/login`, {}, { params });
  // return http.post<ResLogin>(PORT1 + `/login`, qs.stringify(params));
  // return http.get<ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`);
};
// User login
export const sendCode = (params: Login.sendCodeReq) => {
  return http.post("/login/authcode", params, {
    // baseURL: "http://192.168.199.30:9010",
  });
};

// 直接获取token
export const getTokenApi = (params: string | object | undefined) => {
  return http.post("/aiteacher/generatetoken", params);
};
