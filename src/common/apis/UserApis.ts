import {post, postWithoutJson} from "@/utils/request";
import {ResetPasswordDTO, UserLoginDTO} from "@/common/dtos/UserDTOs";
import {UserRegisterDTO} from "@/common/dtos/UserDTOs";

export default {
    login: (userLoginDTO: UserLoginDTO) => postWithoutJson("/user/login", userLoginDTO),
    getUserVO: (username: string) => post("/user/vo?username=" + username),
    loginByToken: () => post("/user/loginByToken"),
    deleteResourceList: (list: string[]) => postWithoutJson("/user/deleteResourceList", list),
    register: (dto: UserRegisterDTO) => postWithoutJson("/user/register", dto),
    resetPassword: (dto: ResetPasswordDTO) => postWithoutJson("/user/resetPassword", dto),
};