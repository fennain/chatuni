import { useDispatch } from "@/redux";
import { setToken } from "@/redux/modules/user";
import { getTokenApi } from "@/api/modules/login";

/**
 * @description
 */
const useRequest = () => {
  const dispatch = useDispatch();

  /**
   * 刷新token
   * @returns
   */
  const getToken = async () => {
    try {
      const { result } = await getTokenApi({
        uid: 1,
        gold: 1000,
      });
      dispatch(setToken(result))
    } catch (error) {
      console.log(error);
    }
  };

  return { getToken };
};

export default useRequest;
