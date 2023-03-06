import {get, post, postWithoutJson} from "@/utils/request";
import {BlogCommentDeleteDTO, BlogCommentGetDTO, BlogCommentPublishDTO} from "@/common/dtos/BlogCommentDTOs";

export default {
    delete: (blogCommentDeleteDTO: BlogCommentDeleteDTO) => postWithoutJson("/blog/comment/delete", blogCommentDeleteDTO),
    get: (blogCommentGetDTO: BlogCommentGetDTO) => postWithoutJson("/blog/comment/get", blogCommentGetDTO),
    hidden: (blogId: number, commentId: number) => post("/blog/comment/hidden/" + blogId + "/" + commentId),
    publish: (blogCommentPublishDTO: BlogCommentPublishDTO) => postWithoutJson("/blog/comment/publish", blogCommentPublishDTO),
};