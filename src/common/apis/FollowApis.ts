import {post, postWithoutJson} from "@/utils/request";
import {FollowCancelDTO, FollowDTO} from "@/common/dtos/FollowDTOs";

export default {
    getTopicList: (follower: string, pageNum: number) => post("/follow/topicList/" + follower + "/" + pageNum),
    getUserList: (follower: string, pageNum: number) => post("/follow/userList/" + follower + "/" + pageNum),
    getFollowerList: (followee: string, type: number, pageNum: number) => post("/follow/followerList/" + followee + "/" + type + "/" + pageNum),
    follow: (followDTO: FollowDTO) => postWithoutJson("/follow/follow", followDTO),
    followCancel: (followCancelDTO: FollowCancelDTO) => postWithoutJson("/follow/unFollow", followCancelDTO),
};