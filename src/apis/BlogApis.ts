import { post } from "@/utils/request";

export default {
    getBlog: (id: number) => post("/blog/get/" + id),
};