import { get, post, postWithoutJson } from "@/utils/request";

export default {
  get: (id: number, pageNum: number) =>
    get("/api/blogComment/getLimit/" + id + "/" + pageNum),
  publish: (params: object) => post("/api/blogComment/publish", params),
  delete: (params: object) => post("/api/blogComment/delete", params),
};
