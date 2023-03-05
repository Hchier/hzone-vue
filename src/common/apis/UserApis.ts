import { postWithoutJson } from "@/utils/request";
import { UserLoginDTO } from "@/common/dtos/UserDTOs";

export default {
    login: (userLoginDTO: UserLoginDTO) => postWithoutJson("/user/login", userLoginDTO),
};