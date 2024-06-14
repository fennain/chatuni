import http from "@/api";

// 获取课程等级
export const getcourses = () => {
  return http.post<coursesLevel[]>(
    `/user/getcourses`,
    { type: 1 },
    { loading: true }
  );
};

// 获取课程详情
export const getcoursesdetail = (id: string) => {
  return http.post<any>(
    `/user/getcoursesdetail`,
    { type: 1, id },
    { loading: true }
  );
};
