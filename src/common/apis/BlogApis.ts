import {post, postWithoutJson} from "@/utils/request";
import {BlogUpdateDTO} from "@/common/dtos/BlogDTOs";

export default {
    getBlog: (id: number) => post("/blog/get/" + id),
    getHomeList: () => post("/blog/homeList"),
    getPublishedList: (username: string, pageNum: number) => post("/blog/publishedList/" + username + "/" + pageNum),
    getFavorList: (username: string, pageNum: number) => post("/blog/favorList/" + username + "/" + pageNum),
    blogFavor: (blogId: number, author: string) => post("/blog/favor/" + blogId + "/" + author),
    blogUnFavor: (blogId: number, author: string) => post("/blog/unFavor/" + blogId + "/" + author),
    blogUpdate: (dto: BlogUpdateDTO) => postWithoutJson("/blog/update", dto),
    getListByTopic: (name: string, pageNum: number) => post("/blog/listByTopic/" + name + "/" + pageNum),
};