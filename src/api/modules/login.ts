import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

/**
 * @name AuthModule
 */
// User login
export const loginApi = (params: Login.loginReq) => {
  return http.post<any>(
    `/phonelogin/login`,
    {
      ...params,
      system: 3,
    },
    {
      // baseURL: "http://192.168.199.27:9011",
    }
  );
  // return http.post<ResLogin>(PORT1 + `/login`, params, { loading: false });
  // return http.post<ResLogin>(PORT1 + `/login`, {}, { params });
  // return http.post<ResLogin>(PORT1 + `/login`, qs.stringify(params));
  // return http.get<ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`);
};
// User login
export const sendCode = (params: Login.sendCodeReq) => {
  return http.post("/phonelogin/authcode", params, {
    // baseURL: "http://192.168.199.27:9011",
  });
};

// User logout
export const getTokenApi = (params) => {
  return http.post("/aiteacher/generatetoken", params);
};
