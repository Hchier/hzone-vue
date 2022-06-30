import { get, post } from "@/utils/request";

export default {
  getCurrentUser: () => get("/getCurrentUser"),
};
