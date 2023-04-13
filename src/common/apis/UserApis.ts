import {post, postWithoutJson} from "@/utils/request";
import {UserLoginDTO} from "@/common/dtos/UserDTOs";

export default {
    login: (userLoginDTO: UserLoginDTO) => postWithoutJson("/user/login", userLoginDTO),
    getUserVO: (username: string) => post("/user/vo?username=" + username),
    loginByToken: () => post("/user/loginByToken"),
    deleteResourceList: (list: string[]) => postWithoutJson("/user/deleteResourceList", list),
};