import { get, post, postWithoutJson } from "@/utils/request";

export default {
    delete: (commentId: number, blogId: number) => post("/blog/comment/delete/" + commentId + "/" + blogId),
    get: (blogId: number, baseComment: number, pageNum: number) => post("/blog/comment/get/" + blogId + "/" + baseComment + "/" + pageNum),
};