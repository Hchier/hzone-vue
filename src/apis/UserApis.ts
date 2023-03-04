import { postWithoutJson } from "@/utils/request";
import { UserLoginDTO } from "@/utils/dtos";

export default {
    login: (userLoginDTO: UserLoginDTO) => postWithoutJson("/user/login", userLoginDTO),
};