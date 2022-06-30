import { get, post } from "@/utils/request";

export default {
  favor: (params: object) => post("/api/blogFavor/favor", params),
  favorCancel: (params: object) => post("/api/blogFavor/favorCancel", params),
};
