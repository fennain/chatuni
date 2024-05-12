import { RouteObject } from "react-router-dom";

export interface MetaProps {
  key?: string;
  icon?: string;
  title?: string;
}

export type RouteObjectType = Omit<RouteObject, "children"> & {
  redirect?: string;
  meta?: MetaProps;
  children?: RouteObjectType[];
};
