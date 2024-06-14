import http from "@/api";

/**
 * @name AuthModule
 */
// 下单
export const createpayorder = (params: Shop.creatOrderReq) => {
  return http.post<any>(`/pay/createpayorder`, params, {
    // baseURL: "http://192.168.199.30:9012",
  });
};
// 商品列表
export const goodsListApi = () => {
  return http.get<Shop.goodsList[]>(
    "/pay/getpricelist",
    {},
    {
      // baseURL: "http://192.168.199.30:9012",
    }
  );
};
