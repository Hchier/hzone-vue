import {get, post, postWithoutJson} from "@/utils/request";
import {BlogCommentDeleteDTO, BlogCommentGetDTO} from "@/common/dtos/BlogCommentDTOs";

export default {
    delete: (blogCommentDeleteDTO: BlogCommentDeleteDTO) => postWithoutJson("/blog/comment/delete", blogCommentDeleteDTO),
    get: (blogCommentGetDTO: BlogCommentGetDTO) => postWithoutJson("/blog/comment/get", blogCommentGetDTO),
};