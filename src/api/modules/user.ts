import { project_name, h5game_name } from "@/config";
import http from "@/api";

/**
 * @name UserModule
 */

/**
 * 上传录音文件
 * @returns
 */
export const uploadApi = <T>(params: FormData) => {
  return http.post<T>(`/aiteacher/upload`, params, { loading: true });
};

/**
 * 语音转文本
 * @param params
 * @returns
 */
export const speech2textApi = <T>(params: speech2text) => {
  return http.post<T>(`/aiteacher/speech2text`, params, { loading: true });
};

/**
 * 语音打点
 * @param params
 * @returns
 */
export const recordaudioApi = <T>(params: any) => {
  return http.post<T>(`/aiteacher/recordaudio`, params, { loading: false });
};

/**
 * 文本转语音
 * @param params
 * @returns
 */
export const text2speechApi = <T>(params: text2speech) => {
  return http.post<T>(`/aiteacher/text2speech`, params, { loading: true });
};

/**
 * 外教列表
 * @param params
 * @returns
 */
export const teacherlistApi = <T>() => {
  return http.get<T>(`/aiteacher/foreignteacherlist`, {}, { loading: true });
};

/**
 * 打招呼
 * @param params
 * @returns
 */
export const greetingApi = <T>(params: any) => {
  return http.post<T>(`/aiteacher/greeting`, params, { loading: true });
};

/**
 * 聊天,语音转文本
 * @param params
 * @returns
 */
export const chattransApi = <T>(params: any) => {
  return http.post<T>(`/aiteacher/chattrans`, params, {
    loading: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
/**
 * 聊天
 * @param params
 * @returns
 */
export const chatvoiceApi = <T>(params: any) => {
  return http.post<T>(`/aiteacher/chatvoice`, params, {
    loading: true,
  });
};

export const getUserInfoApi = () => {
  return http.post("/user/getuserinfo");
};
export const setUserInfoApi = (data) => {
  return http.post("/user/modifyuserinfo", data);
};
