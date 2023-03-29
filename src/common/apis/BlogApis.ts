import {post} from "@/utils/request";

export default {
    getBlog: (id: number) => post("/blog/get/" + id),
    getHomeList: () => post("/blog/homeList"),
    getPublishedList: (username: string, pageNum: number) => post("/blog/publishedList/" + username + "/" + pageNum),
    getFavorList: (username: string, pageNum: number) => post("/blog/favorList/" + username + "/" + pageNum),
    blogFavor: (blogId: number, author: string) => post("/blog/favor/" + blogId + "/" + author),
    blogUnFavor: (blogId: number, author: string) => post("/blog/unFavor/" + blogId + "/" + author),
};