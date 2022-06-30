import { get, post } from "@/utils/request";

export default {
  login: (params: object) => post("/login", params),
};
