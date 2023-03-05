import {get, post, postWithoutJson} from "@/utils/request";
import {BlogCommentDeleteDTO} from "@/common/dtos/BlogCommentDTOs";

export default {
    delete: (blogCommentDeleteDTO: BlogCommentDeleteDTO) => postWithoutJson("/blog/comment/delete", blogCommentDeleteDTO),
    get: (blogId: number, baseComment: number, pageNum: number) => post("/blog/comment/get/" + blogId + "/" + baseComment + "/" + pageNum),
};