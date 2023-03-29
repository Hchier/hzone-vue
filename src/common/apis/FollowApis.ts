import {post} from "@/utils/request";

export default {
    getFollowList: (follower: string, type: number, pageNum: number) => post("/follow/followList/" + follower + "/" + type + "/" + pageNum),
    getFollowedList: (followee: string, type: number, pageNum: number) => post("/follow/followedList/" + followee + "/" + type + "/" + pageNum),
};