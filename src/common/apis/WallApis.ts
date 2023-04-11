import {post, postWithoutJson} from "@/utils/request";
import {WallAddDTO} from "@/common/dtos/WallDTOs";

export default {
    getList: (receiver: string, pageNum: number) => post("/wall/get/" + receiver + "/" + pageNum),
    hidden: (id: number) => post("/wall/hidden/" + id),
    delete: (id: number) => post("/wall/delete/" + id),
    add: (dto: WallAddDTO) => postWithoutJson("/wall/add", dto),
};