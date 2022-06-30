import { get, post } from "@/utils/request";

export default {
  getBlogCardList: () => get("/api/blog/getRandom"),
  getBlogById: (id: number) => get("/api/blog/get/" + id),
};
