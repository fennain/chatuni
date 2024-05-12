import { notification } from "@/hooks/useMessage";
import { useDispatch } from "@/redux";
import { setToken } from "@/redux/modules/user";
import { setProjectList } from "@/redux/modules/auth";
import { getAuthMenuListApi } from "@/api/modules/login";

/**
 * @description  Use permissions hook
 */
const usePermissions = () => {
  const dispatch = useDispatch();

  const initPermissions = async (token: string) => {
    if (token) {
      try {

        // Get menu list
        const { data: projectList } = await getAuthMenuListApi();
        dispatch(setProjectList(projectList));

        // No projectList
        // if (!projectList.length) {
        //   notification.warning({
        //     message: "无权限访问",
        //     description: "当前账号无任何菜单权限，请联系系统管理员！"
        //   });
        //   dispatch(setToken(""));
        //   return Promise.reject("No permission");
        // }
      } catch (error) {
        // When the projectList request error occurs, clear the token
        dispatch(setToken(""));
        return Promise.reject(error);
      }
    }
  };

  return { initPermissions };
};

export default usePermissions;
