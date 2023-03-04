import { get, post, postWithoutJson } from "@/utils/request";

export default {
    delete: (commentId: number, blogId: number) => post("/blog/comment/delete/" + commentId + "/" + blogId),
    get: (blogId: number, commentOf: number, pageNum: number) => post("/blog/comment/get/" + blogId + "/" + commentOf + "/" + pageNum),
};